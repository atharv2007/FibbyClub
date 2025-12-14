"""
Embedder Agent Service
Fetches user data from MongoDB and updates embeddings in ChromaDB
Supports multiple embedding backends with graceful fallback
"""
import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path

import chromadb
from chromadb.config import Settings
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class BaseEmbedder:
    """Base class for embedders"""
    
    def encode(self, texts: List[str], show_progress_bar: bool = False) -> List[List[float]]:
        raise NotImplementedError


class SentenceTransformerEmbedder(BaseEmbedder):
    """Local sentence-transformers embedder (if available)"""
    
    def __init__(self):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimensions = 384
    
    def encode(self, texts: List[str], show_progress_bar: bool = False) -> List[List[float]]:
        return self.model.encode(texts, show_progress_bar=show_progress_bar).tolist()


class OpenAIEmbedder(BaseEmbedder):
    """OpenAI Embeddings wrapper (requires valid OpenAI API key)"""
    
    def __init__(self, api_key: str, base_url: str = None):
        from openai import OpenAI
        
        if base_url:
            self.client = OpenAI(api_key=api_key, base_url=base_url)
        else:
            self.client = OpenAI(api_key=api_key)
        
        self.model_name = "text-embedding-3-small"
        self.dimensions = 1536
    
    def encode(self, texts: List[str], show_progress_bar: bool = False) -> List[List[float]]:
        if not texts:
            return []
        
        response = self.client.embeddings.create(
            model=self.model_name,
            input=texts,
            encoding_format="float"
        )
        
        return [item.embedding for item in response.data]


class NoOpEmbedder(BaseEmbedder):
    """Fallback embedder that returns empty - used when no embedding backend is available"""
    
    def __init__(self):
        self.dimensions = 384
        logger.warning("Using NoOp embedder - RAG will not work but chat will still function")
    
    def encode(self, texts: List[str], show_progress_bar: bool = False) -> List[List[float]]:
        # Return empty embeddings - this will effectively disable RAG
        return [[0.0] * self.dimensions for _ in texts]


def get_embedder() -> BaseEmbedder:
    """
    Get the best available embedder with fallback chain:
    1. Try sentence-transformers (best for local/deployment)
    2. Try OpenAI embeddings (if valid API key)
    3. Fall back to NoOp (RAG disabled but app still works)
    """
    
    # Option 1: Try sentence-transformers (preferred for deployment)
    try:
        embedder = SentenceTransformerEmbedder()
        logger.info("Using sentence-transformers embedder (all-MiniLM-L6-v2)")
        return embedder
    except ImportError:
        logger.info("sentence-transformers not available, trying alternatives...")
    except Exception as e:
        logger.warning(f"Failed to initialize sentence-transformers: {e}")
    
    # Option 2: Try OpenAI embeddings with standard API key
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key and not openai_key.startswith("sk-emergent"):
        try:
            embedder = OpenAIEmbedder(openai_key)
            # Test with a simple embedding
            embedder.encode(["test"])
            logger.info("Using OpenAI embeddings (text-embedding-3-small)")
            return embedder
        except Exception as e:
            logger.warning(f"Failed to initialize OpenAI embedder: {e}")
    
    # Option 3: Fall back to NoOp
    logger.warning("No embedding backend available - using NoOp embedder")
    return NoOpEmbedder()


class EmbedderAgent:
    """Agent that embeds user financial data into vector database"""
    
    def __init__(self):
        # Initialize ChromaDB client (persistent storage)
        self.chroma_client = chromadb.PersistentClient(
            path=str(ROOT_DIR / "chroma_db"),
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Create or get collection
        self.collection = self.chroma_client.get_or_create_collection(
            name="user_financial_data",
            metadata={"description": "User financial data embeddings for Fibby"}
        )
        
        # Initialize embedding model with fallback chain
        logger.info("Initializing embedding model...")
        self.model = get_embedder()
        logger.info(f"Embedding model initialized: {type(self.model).__name__}")
        
        # Track if RAG is functional
        self.rag_enabled = not isinstance(self.model, NoOpEmbedder)
        
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        self.mongo_client = AsyncIOMotorClient(mongo_url)
        self.db = self.mongo_client[os.environ['DB_NAME']]
        
        # Transaction ID tracking (user_id -> transaction_id)
        self.user_transactions: Dict[str, str] = {}
    
    def is_rag_enabled(self) -> bool:
        """Check if RAG functionality is available"""
        return self.rag_enabled
    
    async def fetch_user_data(self, user_id: str) -> Dict:
        """Fetch all relevant data for a user from MongoDB"""
        try:
            # Fetch user profile
            user = await self.db.users.find_one({"_id": ObjectId(user_id)})
            
            # Fetch transactions (last 100)
            transactions = await self.db.transactions.find(
                {"user_id": user_id}
            ).sort("date", -1).limit(100).to_list(100)
            
            # Fetch goals
            goals = await self.db.goals.find({"user_id": user_id}).to_list(100)
            
            # Fetch investments - use correct collection names
            holdings = await self.db.stock_holdings.find(
                {"user_id": user_id}
            ).to_list(100)
            
            mutual_funds = await self.db.mutual_funds.find(
                {"user_id": user_id}
            ).to_list(100)
            
            other_investments = await self.db.other_investments.find(
                {"user_id": user_id}
            ).to_list(100)
            
            # Fetch bank account
            account = await self.db.bank_accounts.find_one({"user_id": user_id})
            
            # Fetch insights
            insights = await self.db.insights.find({"user_id": user_id}).to_list(100)
            
            return {
                "user": user,
                "transactions": transactions,
                "goals": goals,
                "holdings": holdings,
                "mutual_funds": mutual_funds,
                "other_investments": other_investments,
                "account": account,
                "insights": insights,
                "fetched_at": datetime.utcnow().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Error fetching user data: {str(e)}")
            return None
    
    def create_embedding_chunks(self, user_id: str, data: Dict) -> List[Dict]:
        """Create text chunks from user data for embedding"""
        chunks = []
        timestamp = data.get("fetched_at", datetime.utcnow().isoformat())
        
        # User profile chunk
        if data.get("user"):
            user = data["user"]
            chunks.append({
                "id": f"{user_id}_profile",
                "text": f"User {user.get('name')} ({user.get('email')}) from {user.get('location', 'India')}. Phone: {user.get('phone')}",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "profile",
                    "timestamp": timestamp
                }
            })
        
        # Account balance chunk
        if data.get("account"):
            account = data["account"]
            chunks.append({
                "id": f"{user_id}_account",
                "text": f"Account balance: ₹{account.get('balance', 0):,.2f}. Bank: {account.get('bank_name')}. Account type: {account.get('account_type')}",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "account",
                    "timestamp": timestamp
                }
            })
        
        # Transactions summary chunk
        if data.get("transactions"):
            transactions = data["transactions"]
            total_expense = sum(t.get("amount", 0) for t in transactions if t.get("transaction_type") == "expense")
            total_income = sum(t.get("amount", 0) for t in transactions if t.get("transaction_type") == "income")
            categories = list(set(t.get("category", "Unknown") for t in transactions))
            
            chunks.append({
                "id": f"{user_id}_transactions_summary",
                "text": f"Transaction history: {len(transactions)} recent transactions. Total expenses: ₹{total_expense:,.2f}. Total income: ₹{total_income:,.2f}. Categories: {', '.join(categories[:10])}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "transactions_summary",
                    "transaction_count": len(transactions),
                    "timestamp": timestamp
                }
            })
            
            # Individual transaction chunks (top 30)
            for idx, txn in enumerate(transactions[:30]):
                chunks.append({
                    "id": f"{user_id}_txn_{idx}",
                    "text": f"Transaction: {txn.get('description', 'Payment')} - ₹{txn.get('amount', 0):,.2f} ({txn.get('transaction_type', 'expense')}) in {txn.get('category', 'Unknown')} category at {txn.get('merchant', 'Unknown')}",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "transaction",
                        "timestamp": timestamp
                    }
                })
        
        # Goals chunks
        if data.get("goals"):
            goals = data["goals"]
            for goal in goals:
                progress = (goal.get("saved_amount", 0) / max(goal.get("target_amount", 1), 1)) * 100
                auto_save = f"Auto-save: ₹{goal.get('auto_save_amount', 0):,.2f}/month" if goal.get('auto_save_enabled') else "No auto-save"
                chunks.append({
                    "id": f"{user_id}_goal_{goal.get('_id')}",
                    "text": f"Financial goal: {goal.get('name')} - Target: ₹{goal.get('target_amount', 0):,.2f}, Saved: ₹{goal.get('saved_amount', 0):,.2f} ({progress:.1f}% complete). {auto_save}",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "goal",
                        "timestamp": timestamp
                    }
                })
        
        # Stock holdings chunk
        if data.get("holdings"):
            holdings = data["holdings"]
            total_value = sum(h.get("last_price", 0) * h.get("quantity", 0) for h in holdings)
            total_invested = sum(h.get("average_price", 0) * h.get("quantity", 0) for h in holdings)
            total_pnl = sum(h.get("pnl", 0) for h in holdings)
            stock_names = [h.get("tradingsymbol", "Unknown") for h in holdings]
            
            chunks.append({
                "id": f"{user_id}_stock_holdings",
                "text": f"Stock portfolio: {len(holdings)} stocks ({', '.join(stock_names)}). Current value: ₹{total_value:,.2f}. Invested: ₹{total_invested:,.2f}. Total P&L: ₹{total_pnl:,.2f}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "investments_holdings",
                    "timestamp": timestamp
                }
            })
            
            # Individual stock chunks
            for stock in holdings:
                chunks.append({
                    "id": f"{user_id}_stock_{stock.get('tradingsymbol')}",
                    "text": f"Stock: {stock.get('tradingsymbol')} on {stock.get('exchange')}. Qty: {stock.get('quantity')}, Avg price: ₹{stock.get('average_price'):,.2f}, Current: ₹{stock.get('last_price'):,.2f}, P&L: ₹{stock.get('pnl'):,.2f}",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "stock",
                        "timestamp": timestamp
                    }
                })
        
        # Mutual funds chunk
        if data.get("mutual_funds"):
            mfs = data["mutual_funds"]
            total_mf_value = sum(mf.get("last_price", 0) * mf.get("quantity", 0) for mf in mfs)
            total_mf_invested = sum(mf.get("average_price", 0) * mf.get("quantity", 0) for mf in mfs)
            total_mf_pnl = sum(mf.get("pnl", 0) for mf in mfs)
            active_sips = [mf for mf in mfs if mf.get("is_sip")]
            total_sip_amount = sum(mf.get("sip_amount", 0) or 0 for mf in active_sips)
            
            chunks.append({
                "id": f"{user_id}_mutual_funds",
                "text": f"Mutual funds: {len(mfs)} funds. Current value: ₹{total_mf_value:,.2f}. Invested: ₹{total_mf_invested:,.2f}. P&L: ₹{total_mf_pnl:,.2f}. Active SIPs: {len(active_sips)} totaling ₹{total_sip_amount:,.2f}/month.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "mutual_funds",
                    "timestamp": timestamp
                }
            })
            
            # Individual MF chunks
            for mf in mfs:
                sip_info = f"SIP: ₹{mf.get('sip_amount', 0):,}/month on {mf.get('sip_date')}th" if mf.get('is_sip') else "Lumpsum investment"
                chunks.append({
                    "id": f"{user_id}_mf_{mf.get('folio')}",
                    "text": f"Mutual Fund: {mf.get('fund')}. Units: {mf.get('quantity'):.2f}, NAV: ₹{mf.get('last_price'):,.2f}, P&L: ₹{mf.get('pnl'):,.2f}. {sip_info}",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "mutual_fund",
                        "timestamp": timestamp
                    }
                })
        
        # Other investments chunk
        if data.get("other_investments"):
            other_invs = data["other_investments"]
            total_other_value = sum(inv.get("current_value", 0) for inv in other_invs)
            total_other_invested = sum(inv.get("amount_invested", 0) for inv in other_invs)
            total_other_returns = sum(inv.get("returns", 0) for inv in other_invs)
            inv_types = list(set(inv.get("type", "other") for inv in other_invs))
            
            chunks.append({
                "id": f"{user_id}_other_investments",
                "text": f"Other investments: {len(other_invs)} investments ({', '.join(inv_types)}). Total value: ₹{total_other_value:,.2f}. Invested: ₹{total_other_invested:,.2f}. Returns: ₹{total_other_returns:,.2f}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "other_investments",
                    "timestamp": timestamp
                }
            })
            
            # Individual other investment chunks
            for inv in other_invs:
                inv_name = inv.get('name', 'Unknown').replace(' ', '_')[:20]
                chunks.append({
                    "id": f"{user_id}_inv_{inv.get('type')}_{inv_name}",
                    "text": f"{inv.get('type', 'other').upper()}: {inv.get('name')}. Invested: ₹{inv.get('amount_invested', 0):,.2f}, Current: ₹{inv.get('current_value', 0):,.2f}, Returns: {inv.get('returns_percentage', 0):.1f}%",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": f"investment_{inv.get('type')}",
                        "timestamp": timestamp
                    }
                })
        
        # Insights chunks
        if data.get("insights"):
            for idx, insight in enumerate(data["insights"]):
                chunks.append({
                    "id": f"{user_id}_insight_{idx}",
                    "text": f"Financial insight ({insight.get('type')}): {insight.get('message')}",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "insight",
                        "timestamp": timestamp
                    }
                })
        
        return chunks
    
    async def update_user_embeddings(self, user_id: str) -> Optional[str]:
        """
        Fetch user data, create embeddings, and update vector DB
        Returns transaction_id for this update, or None if RAG is disabled
        """
        if not self.rag_enabled:
            logger.info(f"RAG disabled - skipping embedding update for user {user_id}")
            return None
        
        try:
            logger.info(f"Updating embeddings for user: {user_id}")
            
            # Fetch user data
            user_data = await self.fetch_user_data(user_id)
            if not user_data:
                logger.error(f"Failed to fetch data for user: {user_id}")
                return None
            
            # Create chunks
            chunks = self.create_embedding_chunks(user_id, user_data)
            logger.info(f"Created {len(chunks)} chunks for user {user_id}")
            
            if not chunks:
                logger.warning(f"No chunks created for user {user_id}")
                return None
            
            # Generate transaction ID (timestamp-based)
            transaction_id = f"txn_{user_id}_{int(datetime.utcnow().timestamp())}"
            
            # Delete existing embeddings for this user
            try:
                existing = self.collection.get(where={"user_id": user_id})
                if existing and existing["ids"]:
                    self.collection.delete(ids=existing["ids"])
                    logger.info(f"Deleted {len(existing['ids'])} existing embeddings for user {user_id}")
            except Exception as e:
                logger.warning(f"No existing embeddings to delete: {str(e)}")
            
            # Prepare data for ChromaDB
            ids = [chunk["id"] for chunk in chunks]
            texts = [chunk["text"] for chunk in chunks]
            metadatas = [
                {**chunk["metadata"], "transaction_id": transaction_id}
                for chunk in chunks
            ]
            
            # Generate embeddings
            logger.info(f"Generating embeddings for {len(texts)} chunks...")
            embeddings = self.model.encode(texts, show_progress_bar=False)
            
            # Add to ChromaDB
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas
            )
            
            logger.info(f"Successfully added {len(chunks)} embeddings for user {user_id} with transaction_id: {transaction_id}")
            
            # Track transaction ID
            self.user_transactions[user_id] = transaction_id
            
            return transaction_id
        
        except Exception as e:
            logger.error(f"Error updating embeddings for user {user_id}: {str(e)}")
            return None
    
    async def update_all_users(self):
        """Update embeddings for all users in the database"""
        if not self.rag_enabled:
            logger.info("RAG disabled - skipping embedding updates for all users")
            return
        
        try:
            # Get all users
            users = await self.db.users.find().to_list(1000)
            logger.info(f"Found {len(users)} users to process")
            
            for user in users:
                user_id = str(user["_id"])
                await self.update_user_embeddings(user_id)
                await asyncio.sleep(0.5)  # Rate limiting
            
            logger.info("Completed embedding updates for all users")
        
        except Exception as e:
            logger.error(f"Error updating all users: {str(e)}")
    
    def get_user_transactions(self) -> Dict[str, str]:
        """Get mapping of user_id -> transaction_id"""
        return self.user_transactions
    
    def print_transaction_report(self):
        """Print a formatted report of users and their transaction IDs"""
        print("\n" + "="*80)
        print("VECTOR DATABASE - USER TRANSACTION IDs")
        print("="*80)
        print(f"RAG Enabled: {self.rag_enabled}")
        print(f"Embedder: {type(self.model).__name__}")
        print(f"Total Users: {len(self.user_transactions)}")
        print(f"Vector DB Location: {ROOT_DIR / 'chroma_db'}")
        print(f"Total Documents in DB: {self.collection.count()}")
        print("="*80)
        print(f"{'User ID':<30} {'Transaction ID':<50}")
        print("-"*80)
        
        for user_id, txn_id in self.user_transactions.items():
            print(f"{user_id:<30} {txn_id:<50}")
        
        print("="*80)
        print("\n")
    
    async def close(self):
        """Cleanup resources"""
        self.mongo_client.close()


# Main execution
async def main():
    """Main function to run the embedder agent"""
    agent = EmbedderAgent()
    
    try:
        # Update embeddings for all users
        await agent.update_all_users()
        
        # Print transaction report
        agent.print_transaction_report()
    
    finally:
        await agent.close()


if __name__ == "__main__":
    asyncio.run(main())

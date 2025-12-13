"""
Embedder Agent Service
Continuously fetches user data from MongoDB and updates embeddings in ChromaDB
"""
import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List
from pathlib import Path

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

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
        
        # Initialize embedding model (lightweight and fast)
        logger.info("Loading embedding model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Embedding model loaded successfully")
        
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        self.mongo_client = AsyncIOMotorClient(mongo_url)
        self.db = self.mongo_client[os.environ['DB_NAME']]
        
        # Transaction ID tracking (user_id -> transaction_id)
        self.user_transactions: Dict[str, str] = {}
    
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
            
            # Fetch investments
            holdings = await self.db.investment_holdings.find(
                {"user_id": user_id}
            ).to_list(100)
            
            mutual_funds = await self.db.mutual_funds.find(
                {"user_id": user_id}
            ).to_list(100)
            
            sips = await self.db.sips.find({"user_id": user_id}).to_list(100)
            
            # Fetch bank account
            account = await self.db.bank_accounts.find_one({"user_id": user_id})
            
            return {
                "user": user,
                "transactions": transactions,
                "goals": goals,
                "holdings": holdings,
                "mutual_funds": mutual_funds,
                "sips": sips,
                "account": account,
                "fetched_at": datetime.utcnow().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Error fetching user data: {str(e)}")
            return None
    
    def create_embedding_chunks(self, user_id: str, data: Dict) -> List[Dict]:
        """Create text chunks from user data for embedding"""
        chunks = []
        
        # User profile chunk
        if data.get("user"):
            user = data["user"]
            chunks.append({
                "id": f"{user_id}_profile",
                "text": f"User {user.get('name')} ({user.get('email')}) - Profile information",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "profile",
                    "timestamp": data["fetched_at"]
                }
            })
        
        # Account balance chunk
        if data.get("account"):
            account = data["account"]
            chunks.append({
                "id": f"{user_id}_account",
                "text": f"Account balance: ₹{account.get('balance', 0):.2f}. Bank: {account.get('bank_name')}",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "account",
                    "timestamp": data["fetched_at"]
                }
            })
        
        # Transactions summary chunk
        if data.get("transactions"):
            transactions = data["transactions"]
            total_spent = sum(t.get("amount", 0) for t in transactions if t.get("type") == "debit")
            total_received = sum(t.get("amount", 0) for t in transactions if t.get("type") == "credit")
            categories = list(set(t.get("category", "Unknown") for t in transactions))
            
            chunks.append({
                "id": f"{user_id}_transactions_summary",
                "text": f"Transaction history: {len(transactions)} recent transactions. Total spent: ₹{total_spent:.2f}. Total received: ₹{total_received:.2f}. Categories: {', '.join(categories[:10])}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "transactions_summary",
                    "transaction_count": len(transactions),
                    "timestamp": data["fetched_at"]
                }
            })
            
            # Individual transaction chunks (top 20)
            for idx, txn in enumerate(transactions[:20]):
                chunks.append({
                    "id": f"{user_id}_txn_{idx}",
                    "text": f"Transaction: {txn.get('description')} - ₹{txn.get('amount', 0):.2f} ({txn.get('type')}) in {txn.get('category')} category at {txn.get('merchant', 'Unknown')}",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "transaction",
                        "timestamp": data["fetched_at"]
                    }
                })
        
        # Goals chunk
        if data.get("goals"):
            goals = data["goals"]
            for goal in goals:
                progress = (goal.get("saved_amount", 0) / goal.get("target_amount", 1)) * 100
                chunks.append({
                    "id": f"{user_id}_goal_{goal.get('_id')}",
                    "text": f"Financial goal: {goal.get('name')} - Target: ₹{goal.get('target_amount', 0):.2f}, Saved: ₹{goal.get('saved_amount', 0):.2f} ({progress:.1f}% complete)",
                    "metadata": {
                        "user_id": user_id,
                        "chunk_type": "goal",
                        "timestamp": data["fetched_at"]
                    }
                })
        
        # Investment holdings chunk
        if data.get("holdings"):
            holdings = data["holdings"]
            total_value = sum(h.get("last_price", 0) * h.get("quantity", 0) for h in holdings)
            total_invested = sum(h.get("average_price", 0) * h.get("quantity", 0) for h in holdings)
            total_pnl = sum(h.get("pnl", 0) for h in holdings)
            
            chunks.append({
                "id": f"{user_id}_investments_holdings",
                "text": f"Stock holdings: {len(holdings)} stocks. Current value: ₹{total_value:.2f}. Invested: ₹{total_invested:.2f}. P&L: ₹{total_pnl:.2f}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "investments_holdings",
                    "timestamp": data["fetched_at"]
                }
            })
        
        # Mutual funds chunk
        if data.get("mutual_funds"):
            mfs = data["mutual_funds"]
            total_mf_value = sum(mf.get("current_value", 0) for mf in mfs)
            total_mf_invested = sum(mf.get("invested_value", 0) for mf in mfs)
            
            chunks.append({
                "id": f"{user_id}_mutual_funds",
                "text": f"Mutual funds: {len(mfs)} funds. Current value: ₹{total_mf_value:.2f}. Invested: ₹{total_mf_invested:.2f}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "mutual_funds",
                    "timestamp": data["fetched_at"]
                }
            })
        
        # SIPs chunk
        if data.get("sips"):
            sips = data["sips"]
            active_sips = [s for s in sips if s.get("status") == "active"]
            total_sip_amount = sum(s.get("amount", 0) for s in active_sips)
            
            chunks.append({
                "id": f"{user_id}_sips",
                "text": f"SIP investments: {len(active_sips)} active SIPs. Monthly investment: ₹{total_sip_amount:.2f}.",
                "metadata": {
                    "user_id": user_id,
                    "chunk_type": "sips",
                    "timestamp": data["fetched_at"]
                }
            })
        
        return chunks
    
    async def update_user_embeddings(self, user_id: str) -> str:
        """
        Fetch user data, create embeddings, and update vector DB
        Returns transaction_id for this update
        """
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
            
            # Generate transaction ID (timestamp-based)
            transaction_id = f"txn_{user_id}_{int(datetime.utcnow().timestamp())}"
            
            # Delete existing embeddings for this user
            try:
                self.collection.delete(
                    where={"user_id": user_id}
                )
                logger.info(f"Deleted existing embeddings for user {user_id}")
            except Exception as e:
                logger.warning(f"No existing embeddings to delete: {str(e)}")
            
            # Prepare data for ChromaDB
            ids = [chunk["id"] for chunk in chunks]
            texts = [chunk["text"] for chunk in chunks]
            metadatas = [
                {**chunk["metadata"], "transaction_id": transaction_id}
                for chunk in chunks
            ]
            
            # Generate embeddings using sentence-transformers
            logger.info(f"Generating embeddings for {len(texts)} chunks...")
            embeddings = self.model.encode(texts, show_progress_bar=False).tolist()
            
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
        print(f"Total Users: {len(self.user_transactions)}")
        print(f"Vector DB Location: {ROOT_DIR / 'chroma_db'}")
        print(f"Embedding Model: all-MiniLM-L6-v2")
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

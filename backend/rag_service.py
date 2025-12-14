"""
RAG Service - Retrieval Augmented Generation
Intelligently fetches relevant context from vector database for chat queries
"""
import logging
from typing import List, Dict, Set
from embedder_service import EmbedderAgent

logger = logging.getLogger(__name__)

class RAGService:
    """Service for intelligent context retrieval from vector database"""
    
    def __init__(self, embedder_agent: EmbedderAgent):
        self.embedder = embedder_agent
    
    def expand_query(self, user_query: str) -> List[str]:
        """
        Expand user query into multiple related queries for comprehensive context retrieval
        
        Example:
        Input: "Can I afford a trip to Goa?"
        Output: [
            "Can I afford a trip to Goa?",
            "Goa trip goal",
            "current budget and spending",
            "upcoming bills and expenses",
            "monthly expenditure",
            "available balance"
        ]
        """
        queries = [user_query]  # Always include original query
        
        # Financial affordability queries
        if any(word in user_query.lower() for word in ['afford', 'buy', 'purchase', 'can i']):
            queries.extend([
                "current account balance",
                "monthly budget and spending",
                "upcoming bills and payments",
                "recent expenses"
            ])
        
        # Goal-related queries
        if any(word in user_query.lower() for word in ['goal', 'save', 'saving', 'target']):
            queries.append("financial goals and savings")
        
        # Trip/Travel queries
        if any(word in user_query.lower() for word in ['trip', 'travel', 'vacation', 'goa', 'holiday']):
            queries.extend([
                "travel goals",
                "travel expenses",
                "entertainment spending"
            ])
        
        # Spending analysis queries
        if any(word in user_query.lower() for word in ['spend', 'spent', 'spending', 'expenses']):
            queries.extend([
                "recent transactions",
                "spending by category",
                "monthly expenses"
            ])
        
        # Investment queries
        if any(word in user_query.lower() for word in ['invest', 'portfolio', 'stocks', 'mutual fund', 'sip']):
            queries.extend([
                "investment holdings",
                "mutual funds portfolio",
                "SIP investments"
            ])
        
        # Budget queries
        if any(word in user_query.lower() for word in ['budget', 'monthly']):
            queries.extend([
                "monthly budget",
                "spending limits",
                "budget status"
            ])
        
        return queries
    
    def fetch_relevant_chunks(
        self, 
        user_id: str, 
        user_query: str, 
        max_chunks: int = 15
    ) -> List[Dict]:
        """
        Fetch relevant chunks from vector database using intelligent query expansion
        
        Args:
            user_id: User ID to filter chunks
            user_query: Original user query
            max_chunks: Maximum number of chunks to return
        
        Returns:
            List of relevant chunks with metadata
        """
        try:
            # Expand query for comprehensive retrieval
            queries = self.expand_query(user_query)
            logger.info(f"Expanded query into {len(queries)} search queries")
            
            all_chunks = []
            seen_ids = set()
            
            # Search for each expanded query
            for query in queries:
                try:
                    # Generate query embedding
                    embedding_result = self.embedder.model.encode([query])[0]
                    # Handle both numpy arrays and lists
                    query_embedding = embedding_result.tolist() if hasattr(embedding_result, 'tolist') else embedding_result
                    
                    # Search vector database with user filter
                    results = self.embedder.collection.query(
                        query_embeddings=[query_embedding],
                        n_results=3,  # Top 3 per query
                        where={"user_id": user_id}
                    )
                    
                    # Process results
                    if results and results["ids"] and len(results["ids"][0]) > 0:
                        for i in range(len(results["ids"][0])):
                            chunk_id = results["ids"][0][i]
                            
                            # Avoid duplicates
                            if chunk_id in seen_ids:
                                continue
                            
                            seen_ids.add(chunk_id)
                            all_chunks.append({
                                "id": chunk_id,
                                "text": results["documents"][0][i],
                                "metadata": results["metadatas"][0][i],
                                "distance": results["distances"][0][i],
                                "query": query
                            })
                
                except Exception as e:
                    logger.warning(f"Error searching for query '{query}': {str(e)}")
                    continue
            
            # Sort by relevance (distance) and limit
            all_chunks.sort(key=lambda x: x["distance"])
            relevant_chunks = all_chunks[:max_chunks]
            
            logger.info(f"Retrieved {len(relevant_chunks)} relevant chunks for user query")
            return relevant_chunks
        
        except Exception as e:
            logger.error(f"Error fetching relevant chunks: {str(e)}")
            return []
    
    def group_chunks_by_type(self, chunks: List[Dict]) -> Dict[str, List[Dict]]:
        """Group chunks by their type for better organization"""
        grouped = {
            "profile": [],
            "account": [],
            "transactions": [],
            "goals": [],
            "investments": [],
            "budget": [],
            "other": []
        }
        
        for chunk in chunks:
            chunk_type = chunk["metadata"].get("chunk_type", "other")
            
            if chunk_type in grouped:
                grouped[chunk_type].append(chunk)
            elif chunk_type.startswith("transaction"):
                grouped["transactions"].append(chunk)
            elif chunk_type.startswith("investment"):
                grouped["investments"].append(chunk)
            elif chunk_type.startswith("goal"):
                grouped["goals"].append(chunk)
            else:
                grouped["other"].append(chunk)
        
        # Remove empty categories
        return {k: v for k, v in grouped.items() if v}
    
    def format_context_for_llm(self, chunks: List[Dict]) -> str:
        """
        Format retrieved chunks into a readable context string for LLM
        
        Returns formatted string with sections for different data types
        """
        if not chunks:
            return "No additional context available from user's financial data."
        
        # Group chunks by type
        grouped = self.group_chunks_by_type(chunks)
        
        context_parts = []
        context_parts.append("=== RETRIEVED USER CONTEXT ===\n")
        
        # Profile information
        if "profile" in grouped:
            context_parts.append("USER PROFILE:")
            for chunk in grouped["profile"]:
                context_parts.append(f"- {chunk['text']}")
            context_parts.append("")
        
        # Account balance
        if "account" in grouped:
            context_parts.append("ACCOUNT INFORMATION:")
            for chunk in grouped["account"]:
                context_parts.append(f"- {chunk['text']}")
            context_parts.append("")
        
        # Goals
        if "goals" in grouped:
            context_parts.append("FINANCIAL GOALS:")
            for chunk in grouped["goals"]:
                context_parts.append(f"- {chunk['text']}")
            context_parts.append("")
        
        # Transactions
        if "transactions" in grouped:
            context_parts.append("RECENT TRANSACTIONS:")
            # Limit to top 10 most relevant transactions
            for chunk in grouped["transactions"][:10]:
                context_parts.append(f"- {chunk['text']}")
            context_parts.append("")
        
        # Investments
        if "investments" in grouped:
            context_parts.append("INVESTMENT PORTFOLIO:")
            for chunk in grouped["investments"]:
                context_parts.append(f"- {chunk['text']}")
            context_parts.append("")
        
        # Other relevant data
        if "other" in grouped:
            context_parts.append("OTHER RELEVANT INFORMATION:")
            for chunk in grouped["other"]:
                context_parts.append(f"- {chunk['text']}")
            context_parts.append("")
        
        context_parts.append("=== END OF RETRIEVED CONTEXT ===\n")
        
        return "\n".join(context_parts)
    
    def get_rag_context(self, user_id: str, user_query: str) -> str:
        """
        Main method: Get RAG context for a user query
        
        Args:
            user_id: User ID
            user_query: User's question
        
        Returns:
            Formatted context string ready to be added to LLM prompt
        """
        # Fetch relevant chunks
        chunks = self.fetch_relevant_chunks(user_id, user_query, max_chunks=15)
        
        # Format for LLM
        context = self.format_context_for_llm(chunks)
        
        return context

from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from models import (
    User, BankAccount, Transaction, Goal, Insight, ChatMessage,
    UserCreate, BankAccountCreate, TransactionCreate, GoalCreate,
    ChatRequest, ChatResponse
)
from mock_data import (
    generate_mock_user, generate_mock_bank_account, generate_mock_transactions,
    generate_mock_goals, generate_mock_insights
)
from mock_investment_data import (
    generate_mock_holdings, generate_mock_mutual_funds, generate_mock_other_investments
)
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# ============= USER ROUTES =============
@api_router.get("/")
async def root():
    return {"message": "Fibby API - Your Money Buddy"}

@api_router.post("/users/init")
async def initialize_user():
    """Initialize a mock user with all data"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": "mohit@example.com"})
        
        if existing_user:
            user_id = str(existing_user["_id"])
        else:
            # Create mock user
            user_data = generate_mock_user()
            result = await db.users.insert_one(user_data)
            user_id = str(result.inserted_id)
        
        # Check if data already exists
        existing_account = await db.bank_accounts.find_one({"user_id": user_id})
        
        if not existing_account:
            # Create bank account
            account_data = generate_mock_bank_account(user_id)
            account_result = await db.bank_accounts.insert_one(account_data)
            account_id = str(account_result.inserted_id)
            
            # Create transactions
            transactions = generate_mock_transactions(user_id, account_id, num_months=3)
            if transactions:
                await db.transactions.insert_many(transactions)
            
            # Create goals
            goals = generate_mock_goals(user_id)
            if goals:
                await db.goals.insert_many(goals)
            
            # Create insights
            insights = generate_mock_insights(user_id)
            if insights:
                await db.insights.insert_many(insights)
        
        # Always ensure investment data exists (separate from account creation)
        existing_holdings = await db.investment_holdings.find_one({"user_id": user_id})
        if not existing_holdings:
            holdings = generate_mock_holdings(user_id)
            if holdings:
                await db.investment_holdings.insert_many(holdings)
        
        existing_mf = await db.mutual_funds.find_one({"user_id": user_id})
        if not existing_mf:
            mutual_funds = generate_mock_mutual_funds(user_id)
            if mutual_funds:
                await db.mutual_funds.insert_many(mutual_funds)
        
        existing_other = await db.other_investments.find_one({"user_id": user_id})
        if not existing_other:
            other_investments = generate_mock_other_investments(user_id)
            if other_investments:
                await db.other_investments.insert_many(other_investments)
        
        return {"status": "success", "user_id": user_id, "message": "User initialized"}
    except Exception as e:
        logger.error(f"Error initializing user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Get user by ID"""
    from bson import ObjectId
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        user = await db.users.find_one({"_id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(user)

# ============= BANK ACCOUNT ROUTES =============
@api_router.get("/accounts")
async def get_accounts(user_id: str):
    """Get all bank accounts for a user"""
    accounts = await db.bank_accounts.find({"user_id": user_id}).to_list(100)
    return [serialize_doc(acc) for acc in accounts]

@api_router.get("/accounts/{account_id}")
async def get_account(account_id: str):
    """Get specific bank account"""
    account = await db.bank_accounts.find_one({"_id": account_id})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return serialize_doc(account)

# ============= TRANSACTION ROUTES =============
@api_router.get("/transactions")
async def get_transactions(user_id: str, limit: int = 100, offset: int = 0):
    """Get transactions for a user"""
    transactions = await db.transactions.find(
        {"user_id": user_id}
    ).sort("date", -1).skip(offset).limit(limit).to_list(limit)
    return [serialize_doc(txn) for txn in transactions]

@api_router.get("/transactions/category-breakdown")
async def get_category_breakdown(
    user_id: str, 
    months: int = 1, 
    month: Optional[int] = None, 
    year: Optional[int] = None,
    start_date_str: Optional[str] = None,
    end_date_str: Optional[str] = None
):
    """Get spending breakdown by category"""
    # If start and end date strings provided (for daily/weekly filtering)
    if start_date_str and end_date_str:
        start_date = datetime.fromisoformat(start_date_str)
        end_date = datetime.fromisoformat(end_date_str)
        match_query = {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date, "$lt": end_date}
        }
    # If specific month and year provided, filter for that month only
    elif month and year:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        match_query = {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date, "$lt": end_date}
        }
    else:
        start_date = datetime.utcnow() - timedelta(days=30 * months)
        match_query = {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date}
        }
    
    pipeline = [
        {"$match": match_query},
        {"$group": {
            "_id": "$category",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"total": -1}}
    ]
    
    results = await db.transactions.aggregate(pipeline).to_list(100)
    return results

@api_router.get("/transactions/merchant-leaderboard")
async def get_merchant_leaderboard(
    user_id: str, 
    limit: int = 10, 
    month: Optional[int] = None, 
    year: Optional[int] = None,
    start_date_str: Optional[str] = None,
    end_date_str: Optional[str] = None
):
    """Get top merchants by spending"""
    # If start and end date strings provided (for daily/weekly filtering)
    if start_date_str and end_date_str:
        start_date = datetime.fromisoformat(start_date_str)
        end_date = datetime.fromisoformat(end_date_str)
        match_query = {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date, "$lt": end_date}
        }
    # If specific month and year provided, filter for that month only
    elif month and year:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        match_query = {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date, "$lt": end_date}
        }
    else:
        start_date = datetime.utcnow() - timedelta(days=30)
        match_query = {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date}
        }
    
    pipeline = [
        {"$match": match_query},
        {"$group": {
            "_id": "$merchant",
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1},
            "category": {"$first": "$category"}
        }},
        {"$sort": {"total": -1}},
        {"$limit": limit}
    ]
    
    results = await db.transactions.aggregate(pipeline).to_list(limit)
    return results

@api_router.get("/analytics/monthly-spending")
async def get_monthly_spending(user_id: str, months: int = 6):
    """Get monthly spending aggregation"""
    start_date = datetime.utcnow() - timedelta(days=30 * months)
    
    pipeline = [
        {"$match": {
            "user_id": user_id,
            "transaction_type": "expense",
            "date": {"$gte": start_date}
        }},
        {"$group": {
            "_id": {
                "year": {"$year": "$date"},
                "month": {"$month": "$date"}
            },
            "total": {"$sum": "$amount"}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}}
    ]
    
    results = await db.transactions.aggregate(pipeline).to_list(100)
    
    # Format month names
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    formatted = []
    for item in results:
        month_num = item["_id"]["month"]
        formatted.append({
            "month": month_names[month_num - 1],
            "amount": item["total"],
            "year": item["_id"]["year"],
            "month_num": month_num
        })
    
    return formatted

@api_router.get("/analytics/spending-by-period")
async def get_spending_by_period(user_id: str, period: str = "6mnth"):
    """Get spending data based on selected time period"""
    now = datetime.utcnow()
    
    if period == "1wk":
        # Last 7 days (daily breakdown)
        results = []
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        
        for i in range(6, -1, -1):
            day_date = now - timedelta(days=i)
            start_of_day = datetime(day_date.year, day_date.month, day_date.day)
            end_of_day = start_of_day + timedelta(days=1)
            
            pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "transaction_type": "expense",
                    "date": {"$gte": start_of_day, "$lt": end_of_day}
                }},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ]
            
            result = await db.transactions.aggregate(pipeline).to_list(1)
            amount = result[0]["total"] if result else 0
            
            results.append({
                "month": day_names[day_date.weekday()],
                "amount": amount,
                "date": day_date.strftime("%d %b"),
                "day": day_date.day,
                "month_num": day_date.month,
                "year": day_date.year
            })
        
        return results
    
    elif period == "1mnth":
        # Last 5 weeks (weekly breakdown)
        results = []
        
        for i in range(4, -1, -1):
            week_start = now - timedelta(days=now.weekday() + (i * 7))
            week_end = week_start + timedelta(days=7)
            
            pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "transaction_type": "expense",
                    "date": {"$gte": week_start, "$lt": week_end}
                }},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ]
            
            result = await db.transactions.aggregate(pipeline).to_list(1)
            amount = result[0]["total"] if result else 0
            
            results.append({
                "month": f"W{5-i}",
                "amount": amount,
                "date": f"{week_start.strftime('%d')}-{week_end.strftime('%d %b')}",
                "week_num": 5-i,
                "week_start": week_start.isoformat(),
                "week_end": week_end.isoformat()
            })
        
        return results
    
    elif period == "6mnth":
        # Last 6 months (monthly breakdown)
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        results = []
        
        for i in range(5, -1, -1):
            target_date = now - timedelta(days=30*i)
            start_of_month = datetime(target_date.year, target_date.month, 1)
            
            if target_date.month == 12:
                end_of_month = datetime(target_date.year + 1, 1, 1)
            else:
                end_of_month = datetime(target_date.year, target_date.month + 1, 1)
            
            pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "transaction_type": "expense",
                    "date": {"$gte": start_of_month, "$lt": end_of_month}
                }},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ]
            
            result = await db.transactions.aggregate(pipeline).to_list(1)
            amount = result[0]["total"] if result else 0
            
            results.append({
                "month": month_names[target_date.month - 1],
                "amount": amount,
                "year": target_date.year,
                "month_num": target_date.month
            })
        
        return results
    
    elif period == "1yr":
        # Last 12 months in 6 bi-monthly pairs
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        results = []
        
        for i in range(5, -1, -1):
            # Each bar represents 2 months
            target_date = now - timedelta(days=60*i)
            start_month = target_date.month
            start_year = target_date.year
            
            # Calculate end month (2 months later)
            end_month = start_month + 2
            end_year = start_year
            if end_month > 12:
                end_month -= 12
                end_year += 1
            
            start_of_period = datetime(start_year, start_month, 1)
            end_of_period = datetime(end_year, end_month, 1)
            
            pipeline = [
                {"$match": {
                    "user_id": user_id,
                    "transaction_type": "expense",
                    "date": {"$gte": start_of_period, "$lt": end_of_period}
                }},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
            ]
            
            result = await db.transactions.aggregate(pipeline).to_list(1)
            amount = result[0]["total"] if result else 0
            
            # Calculate the second month in the pair
            second_month = start_month + 1
            if second_month > 12:
                second_month = 1
            
            # Format: "Feb-Mar", "Apr-May", etc.
            label = f"{month_names[start_month-1]}-{month_names[second_month-1]}"
            
            results.append({
                "month": label,
                "amount": amount,
                "period_start": start_of_period.isoformat(),
                "period_end": end_of_period.isoformat(),
                "start_month": start_month,
                "start_year": start_year
            })
        
        return results
    
    # Default to 6 months
    return await get_monthly_spending(user_id, 6)

@api_router.get("/analytics/spend-velocity")
async def get_spend_velocity(user_id: str):
    """Get spending comparison: current month vs last month"""
    now = datetime.utcnow()
    current_month_start = datetime(now.year, now.month, 1)
    last_month_start = current_month_start - timedelta(days=30)
    
    # Current month spending by day
    current_month = await db.transactions.find({
        "user_id": user_id,
        "transaction_type": "expense",
        "date": {"$gte": current_month_start}
    }).to_list(1000)
    
    # Last month spending by day
    last_month = await db.transactions.find({
        "user_id": user_id,
        "transaction_type": "expense",
        "date": {"$gte": last_month_start, "$lt": current_month_start}
    }).to_list(1000)
    
    # Aggregate by day
    current_by_day = {}
    for txn in current_month:
        day = txn["date"].day
        current_by_day[day] = current_by_day.get(day, 0) + txn["amount"]
    
    last_by_day = {}
    for txn in last_month:
        day = txn["date"].day
        last_by_day[day] = last_by_day.get(day, 0) + txn["amount"]
    
    return {
        "current_month": current_by_day,
        "last_month": last_by_day,
        "current_total": sum(current_by_day.values()),
        "last_total": sum(last_by_day.values()),
        "difference": sum(current_by_day.values()) - sum(last_by_day.values())
    }

# ============= GOAL ROUTES =============
@api_router.get("/goals")
async def get_goals(user_id: str):
    """Get all goals for a user"""
    goals = await db.goals.find({"user_id": user_id}).to_list(100)
    return [serialize_doc(goal) for goal in goals]

@api_router.post("/goals")
async def create_goal(goal: GoalCreate, user_id: str):
    """Create a new goal"""
    goal_data = goal.dict()
    goal_data["user_id"] = user_id
    goal_data["saved_amount"] = 0.0
    goal_data["created_at"] = datetime.utcnow()
    
    result = await db.goals.insert_one(goal_data)
    return {"id": str(result.inserted_id), **goal_data}

# ============= INSIGHT ROUTES =============
@api_router.get("/insights")
async def get_insights(user_id: str, unread_only: bool = False):
    """Get insights/nudges for a user"""
    query = {"user_id": user_id}
    if unread_only:
        query["is_read"] = False
    
    insights = await db.insights.find(query).sort("date", -1).to_list(100)
    return [serialize_doc(insight) for insight in insights]

# ============= CHAT ROUTES =============
@api_router.post("/chat")
async def chat_with_fibby(request: ChatRequest):
    """Chat with Fibby AI assistant"""
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # Initialize LLM Chat with Hinglish personality
        chat = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=session_id,
            system_message="""You are Fibby, a friendly Gen-Z finance buddy for Indians. 

Your personality:
- Speak in casual Hinglish (mix of Hindi and English)
- Use phrases like "bro", "yaar", "scene", "chill hai"
- Be encouraging and supportive, never judgemental
- Keep responses short and conversational (2-3 sentences max)
- Use emojis naturally but don't overdo it

Your role:
- Help users understand their spending
- Give practical money advice
- Encourage good financial habits
- Make finance feel fun and approachable

Examples:
- "Bro, you spent ₹5k on Zomato this month. Ghar ka khana bhi try karo! 🍛"
- "Scene sorted hai! You're under budget. Keep it up yaar 📈"
- "Relax bro, sabka hota hai. Next month better karenge 💪"
"""
        ).with_model("openai", "gpt-5.1")
        
        # Send message
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        return ChatResponse(
            message=response,
            widget_data=None,
            session_id=session_id
        )
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def get_user_context(user_id: str, query: str) -> str:
    """Fetch and summarize relevant user data based on the query"""
    try:
        # Keywords to determine what data to fetch
        query_lower = query.lower()
        context_parts = []
        
        # Fetch user basic info
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            context_parts.append(f"User: {user.get('name', 'User')}")
        
        # Budget-related queries
        if any(word in query_lower for word in ['budget', 'spending', 'expense', 'spend', 'money']):
            # Get current month transactions
            from datetime import datetime, timedelta
            current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            transactions = list(await db.transactions.find({
                "user_id": user_id,
                "date": {"$gte": current_month_start}
            }).to_list(length=100))
            
            if transactions:
                total_spent = sum(t.get('amount', 0) for t in transactions if t.get('amount', 0) > 0)
                
                # Category breakdown
                category_spending = {}
                for t in transactions:
                    cat = t.get('category', 'Other')
                    category_spending[cat] = category_spending.get(cat, 0) + t.get('amount', 0)
                
                top_categories = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)[:3]
                
                context_parts.append(f"This Month Spending: ₹{total_spent:,.0f}")
                context_parts.append(f"Top Categories: {', '.join([f'{cat} ₹{amt:,.0f}' for cat, amt in top_categories])}")
                context_parts.append(f"Monthly Budget: ₹45,000")
                context_parts.append(f"Budget Used: {(total_spent/45000)*100:.0f}%")
        
        # Investment-related queries
        if any(word in query_lower for word in ['invest', 'portfolio', 'sip', 'stock', 'mutual', 'fund', 'return']):
            # Get investment data
            holdings = list(await db.investment_holdings.find({"user_id": user_id}).to_list(length=50))
            mutual_funds = list(await db.mutual_funds.find({"user_id": user_id}).to_list(length=50))
            
            if holdings or mutual_funds:
                total_investment = 0
                total_current = 0
                
                for h in holdings:
                    total_investment += h.get('average_price', 0) * h.get('quantity', 0)
                    total_current += h.get('last_price', 0) * h.get('quantity', 0)
                
                for mf in mutual_funds:
                    total_investment += mf.get('average_price', 0) * mf.get('quantity', 0)
                    total_current += mf.get('last_price', 0) * mf.get('quantity', 0)
                
                returns_pct = ((total_current - total_investment) / total_investment * 100) if total_investment > 0 else 0
                
                context_parts.append(f"Total Portfolio Value: ₹{total_current:,.0f}")
                context_parts.append(f"Total Invested: ₹{total_investment:,.0f}")
                context_parts.append(f"Overall Returns: {returns_pct:+.1f}%")
                context_parts.append(f"Holdings: {len(holdings)} stocks, {len(mutual_funds)} mutual funds")
                
                # SIP info
                active_sips = [mf for mf in mutual_funds if mf.get('sip_amount', 0) > 0]
                if active_sips:
                    total_sip = sum(mf.get('sip_amount', 0) for mf in active_sips)
                    context_parts.append(f"Active SIPs: {len(active_sips)} (₹{total_sip:,.0f}/month)")
        
        # Goal-related queries
        if any(word in query_lower for word in ['goal', 'save', 'saving', 'target']):
            goals = list(await db.goals.find({"user_id": user_id}).to_list(length=10))
            if goals:
                context_parts.append(f"Active Goals: {len(goals)}")
                for goal in goals[:2]:  # Top 2 goals
                    progress = (goal.get('current_amount', 0) / goal.get('target_amount', 1)) * 100
                    context_parts.append(f"- {goal.get('name')}: {progress:.0f}% (₹{goal.get('current_amount', 0):,.0f}/₹{goal.get('target_amount', 0):,.0f})")
        
        # Weekend/recent spending
        if any(word in query_lower for word in ['weekend', 'week', 'recent', 'today', 'yesterday']):
            from datetime import datetime, timedelta
            last_7_days = datetime.now() - timedelta(days=7)
            
            recent_txns = list(await db.transactions.find({
                "user_id": user_id,
                "date": {"$gte": last_7_days}
            }).to_list(length=50))
            
            if recent_txns:
                total_recent = sum(t.get('amount', 0) for t in recent_txns if t.get('amount', 0) > 0)
                context_parts.append(f"Last 7 Days Spending: ₹{total_recent:,.0f}")
                context_parts.append(f"Transactions: {len(recent_txns)}")
        
        if not context_parts:
            context_parts.append("No specific financial data found for this query.")
        
        return "\n".join(context_parts)
    
    except Exception as e:
        logger.error(f"Error fetching user context: {str(e)}")
        return "Unable to fetch user data at the moment."

@api_router.post("/chat/message")
async def chat_message(request: dict):
    """Chat endpoint with contextual responses using GPT-4o-mini"""
    try:
        user_id = request.get("user_id", "guest")
        message = request.get("message", "")
        
        # Fetch relevant user data based on the query
        user_context = await get_user_context(user_id, message)
        
        # Build context-aware prompt
        context_prompt = f"""User Query: {message}

Relevant User Data:
{user_context}

Based on this data, provide a helpful response that:
1. Directly answers the user's question with specific data and insights
2. Only include MCQ options when there are natural follow-up paths or decisions to make
3. Keep the response concise but informative"""
        
        # Initialize LLM Chat with professional advisor tone and structured output
        chat = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=f"chat_{user_id}",
            system_message="""You are Fibby, a smart and friendly finance companion helping users become financially self-reliant.

YOUR TONE: Professional but approachable
- Clear, jargon-free language
- Encouraging and supportive
- Focus on actionable insights

RESPONSE LENGTH - Match complexity to query:
- Simple queries (balance, totals): 1 sentence
- Medium queries (status, trends): 2-3 sentences with key insights  
- Complex queries (advice, planning): 3-5 sentences with clear reasoning

YOUR ROLE:
- Provide REAL insights using the data provided
- Analyze trends and give actionable advice
- Help users understand their financial situation
- Make smart recommendations

CRITICAL: You must respond ONLY with valid JSON in this exact structure:

JSON RESPONSE FORMAT:
{
  "summary": "Your response text here (match length to query complexity)",
  "cardType": "spending_breakdown" | "portfolio" | "budget_status" | "goal_progress" | null,
  "metrics": {
    // Structure varies by cardType - see examples below
  },
  "options": ["Option 1", "Option 2"] // 2-4 MCQ options when relevant
}

CARD TYPES & METRICS STRUCTURE:

1. spending_breakdown (for spending queries):
{
  "total": 32400,
  "period": "This Month",
  "categories": [
    {"name": "Food", "emoji": "🍽️", "amount": 12200, "percentage": 38, "color": "#608BB6"},
    {"name": "Travel", "emoji": "🚗", "amount": 8500, "percentage": 26, "color": "#82B1FF"}
  ]
}

2. portfolio (for investment queries):
{
  "currentValue": 523400,
  "invested": 442000,
  "returns": 81400,
  "returnsPercentage": 18.4,
  "assets": [
    {"name": "Equity", "emoji": "📈", "percentage": 60, "returns": 22, "color": "#608BB6"}
  ]
}

3. budget_status (for budget queries):
{
  "spent": 32400,
  "budget": 45000,
  "percentage": 72,
  "topCategories": [
    {"name": "Food", "emoji": "🍽️", "amount": 12200, "color": "#608BB6"}
  ]
}

4. goal_progress (for goal queries):
{
  "goalName": "Goa Trip",
  "target": 50000,
  "current": 36000,
  "percentage": 72,
  "emoji": "✈️"
}

WHEN TO USE CARDS:
- Use cardType when query asks about specific data (spending, budget, investments, goals)
- Set cardType to null for general questions, advice, or explanations
- The card will visualize the data, so keep your summary focused on insights

MCQ OPTIONS (when relevant):
   - Include when there are natural next steps
   - When user needs to make a decision
   - When exploring different aspects of a topic
   - Limit to 2-4 options max

EXAMPLES:

Example 1 - Spending Query (with card):
User Data: Total ₹32,400, Food ₹12,200 (38%), Travel ₹8,500 (26%)
Response:
{
  "summary": "You've spent ₹32,400 this month. Food is your biggest expense at 38%, followed by travel at 26%.",
  "cardType": "spending_breakdown",
  "metrics": {
    "total": 32400,
    "period": "This Month",
    "categories": [
      {"name": "Food", "emoji": "🍽️", "amount": 12200, "percentage": 38, "color": "#608BB6"},
      {"name": "Travel", "emoji": "🚗", "amount": 8500, "percentage": 26, "color": "#82B1FF"},
      {"name": "Shopping", "emoji": "🛒", "amount": 6200, "percentage": 19, "color": "#81C784"},
      {"name": "Bills", "emoji": "💳", "amount": 5500, "percentage": 17, "color": "#FFB74D"}
    ]
  },
  "options": ["Set spending limit for Food", "View daily breakdown", "Compare with last month"]
}

Example 2 - Investment Query (with card):
{
  "summary": "Your portfolio is up 18.4% with ₹81,400 in gains. Equity is driving most returns at +22%.",
  "cardType": "portfolio",
  "metrics": {
    "currentValue": 523400,
    "invested": 442000,
    "returns": 81400,
    "returnsPercentage": 18.4,
    "assets": [
      {"name": "Equity", "emoji": "📈", "percentage": 60, "returns": 22, "color": "#608BB6"},
      {"name": "Debt", "emoji": "📊", "percentage": 30, "returns": 8, "color": "#82B1FF"},
      {"name": "Gold", "emoji": "💰", "percentage": 10, "returns": 12, "color": "#FFD700"}
    ]
  },
  "options": ["Review holdings", "Rebalance portfolio", "Increase SIP"]
}

Example 3 - General Question (no card):
{
  "summary": "SIP (Systematic Investment Plan) is a way to invest a fixed amount regularly in mutual funds. It helps build wealth through rupee cost averaging and compound growth.",
  "cardType": null,
  "metrics": null,
  "options": ["Learn about mutual funds", "How to start a SIP", "Best SIP strategies"]
}

IMPORTANT: Always return valid JSON. The frontend will display only the summary to users and render the card separately."""
        ).with_model("openai", "gpt-5.1")
        
        # Send message with context
        user_message = UserMessage(text=context_prompt)
        response_text = await chat.send_message(user_message)
        
        # Parse JSON response from LLM
        try:
            import json
            # Try to parse the response as JSON
            parsed_response = json.loads(response_text)
            
            # Extract components from parsed JSON
            summary = parsed_response.get("summary", response_text)
            card_type = parsed_response.get("cardType")
            metrics = parsed_response.get("metrics")
            options = parsed_response.get("options", [])
            
            # Build card data if cardType is provided
            card_data = None
            if card_type and metrics:
                card_data = {
                    "type": card_type,
                    **metrics
                }
            
            # Ensure we have some options
            if not options:
                options = [
                    "Check my spending breakdown",
                    "View my budget status", 
                    "See investment portfolio",
                    "Explore financial goals"
                ]
            
            return {
                "response": summary,
                "options": options[:4],  # Limit to 4 options
                "card": card_data,
                "cta": None
            }
            
        except json.JSONDecodeError:
            # Fallback to old parsing if JSON parsing fails
            logger.warning(f"Failed to parse JSON response, falling back to text parsing: {response_text[:100]}...")
            
            # Parse response to extract options (old method)
            options = []
            main_response = response_text
            
            # Simple parsing: look for "OPTIONS:" section
            if "OPTIONS:" in response_text:
                parts = response_text.split("OPTIONS:")
                main_response = parts[0].strip()
                options_text = parts[1].strip()
                
                # Extract options (lines starting with -)
                for line in options_text.split('\n'):
                    line = line.strip()
                    if line.startswith('-'):
                        option = line[1:].strip()
                        if option:
                            options.append(option)
            
            # If no options found, provide default exploration options
            if not options:
                options = [
                    "Check my spending breakdown",
                    "View my budget status",
                    "See investment portfolio",
                    "Explore financial goals"
                ]
            
            return {
                "response": main_response,
                "options": options[:4],
                "card": None,
                "cta": None
            }
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= DASHBOARD ROUTES =============
@api_router.get("/dashboard")
async def get_dashboard_data(user_id: str):
    """Get all data for the home dashboard"""
    try:
        from bson import ObjectId
        # Get user
        try:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
        except:
            user = await db.users.find_one({"_id": user_id})
            
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get accounts
        accounts = await db.bank_accounts.find({"user_id": user_id}).to_list(10)
        
        # Get recent transactions
        recent_transactions = await db.transactions.find(
            {"user_id": user_id}
        ).sort("date", -1).limit(10).to_list(10)
        
        # Get insights
        insights = await db.insights.find(
            {"user_id": user_id}
        ).sort("date", -1).limit(5).to_list(5)
        
        # Get category breakdown
        category_data = await get_category_breakdown(user_id, months=1)
        
        # Get spend velocity
        velocity_data = await get_spend_velocity(user_id)
        
        return {
            "user": serialize_doc(user),
            "accounts": [serialize_doc(acc) for acc in accounts],
            "recent_transactions": [serialize_doc(txn) for txn in recent_transactions],
            "insights": [serialize_doc(ins) for ins in insights],
            "category_breakdown": category_data,
            "spend_velocity": velocity_data
        }
    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= INVESTMENT ROUTES =============
@api_router.get("/investments/portfolio")
async def get_portfolio_summary(user_id: str):
    """Get complete portfolio summary"""
    try:
        # Get all investments
        holdings = await db.investment_holdings.find({"user_id": user_id}).to_list(100)
        mutual_funds = await db.mutual_funds.find({"user_id": user_id}).to_list(100)
        other_investments = await db.other_investments.find({"user_id": user_id}).to_list(100)
        
        # Calculate totals
        holdings_value = sum(h["last_price"] * h["quantity"] for h in holdings)
        holdings_invested = sum(h["average_price"] * h["quantity"] for h in holdings)
        holdings_pnl = holdings_value - holdings_invested
        
        mf_value = sum(m["last_price"] * m["quantity"] for m in mutual_funds)
        mf_invested = sum(m["average_price"] * m["quantity"] for m in mutual_funds)
        mf_pnl = mf_value - mf_invested
        
        other_value = sum(i["current_value"] for i in other_investments)
        other_invested = sum(i["amount_invested"] for i in other_investments)
        other_pnl = other_value - other_invested
        
        total_value = holdings_value + mf_value + other_value
        total_invested = holdings_invested + mf_invested + other_invested
        total_pnl = total_value - total_invested
        total_returns_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0
        
        # Asset allocation
        asset_allocation = {
            "equity": round(holdings_value, 2),
            "mutual_funds": round(mf_value, 2),
            "crypto": sum(i["current_value"] for i in other_investments if i["type"] == "crypto"),
            "fixed_income": sum(i["current_value"] for i in other_investments if i["type"] in ["fd", "bond", "ppf"]),
            "real_estate": sum(i["current_value"] for i in other_investments if i["type"] == "real_estate"),
            "insurance": sum(i["current_value"] for i in other_investments if i["type"] == "insurance"),
            "nps": sum(i["current_value"] for i in other_investments if i["type"] == "nps"),
        }
        
        return {
            "total_value": round(total_value, 2),
            "total_invested": round(total_invested, 2),
            "total_pnl": round(total_pnl, 2),
            "total_returns_percentage": round(total_returns_pct, 2),
            "asset_allocation": asset_allocation,
            "holdings_count": len(holdings),
            "mf_count": len(mutual_funds),
            "other_count": len(other_investments),
        }
    except Exception as e:
        logger.error(f"Portfolio summary error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/investments/holdings")
async def get_holdings(user_id: str):
    """Get all stock holdings"""
    holdings = await db.investment_holdings.find({"user_id": user_id}).to_list(100)
    return [serialize_doc(h) for h in holdings]


@api_router.get("/investments/mutual-funds")
async def get_mutual_funds(user_id: str):
    """Get all mutual fund holdings"""
    funds = await db.mutual_funds.find({"user_id": user_id}).to_list(100)
    return [serialize_doc(f) for f in funds]


@api_router.get("/investments/sips")
async def get_active_sips(user_id: str):
    """Get active SIP investments"""
    sips = await db.mutual_funds.find({"user_id": user_id, "is_sip": True}).to_list(100)
    return [serialize_doc(s) for s in sips]


@api_router.get("/investments/other")
async def get_other_investments(user_id: str, investment_type: Optional[str] = None):
    """Get other investments (FD, Bonds, Crypto, etc.)"""
    query = {"user_id": user_id}
    if investment_type:
        query["type"] = investment_type
    
    investments = await db.other_investments.find(query).to_list(100)
    return [serialize_doc(i) for i in investments]


@api_router.get("/investments/recommendations")
async def get_investment_recommendations(user_id: str):
    """Get investment recommendations (AI + Rule-based ensemble)"""
    try:
        recommendations = []
        
        # Get portfolio data for analysis
        holdings = await db.investment_holdings.find({"user_id": user_id}).to_list(100)
        mutual_funds = await db.mutual_funds.find({"user_id": user_id}).to_list(100)
        other_investments = await db.other_investments.find({"user_id": user_id}).to_list(100)
        
        # Calculate current allocation
        total_equity = sum(h["last_price"] * h["quantity"] for h in holdings)
        total_mf = sum(m["last_price"] * m["quantity"] for m in mutual_funds)
        total_other = sum(i["current_value"] for i in other_investments)
        total_portfolio = total_equity + total_mf + total_other
        
        # Rule-based recommendations
        rule_based = []
        
        # Check for missing asset classes
        crypto_invested = sum(i["current_value"] for i in other_investments if i["type"] == "crypto")
        if crypto_invested == 0 or crypto_invested < total_portfolio * 0.05:
            rule_based.append({
                "type": "rule",
                "title": "Consider Crypto Allocation",
                "description": "Allocate 5-10% to crypto for portfolio diversification",
                "asset_class": "Cryptocurrency",
                "priority": 3,
                "reasoning": "You have minimal/no crypto exposure. Consider starting small."
            })
        
        gold_invested = sum(i["current_value"] for i in other_investments if "gold" in i["name"].lower())
        if gold_invested == 0:
            rule_based.append({
                "type": "rule",
                "title": "Add Gold to Portfolio",
                "description": "Invest in Gold ETF or Sovereign Gold Bonds",
                "asset_class": "Gold",
                "priority": 4,
                "reasoning": "Gold provides hedge against inflation and market volatility."
            })
        
        # Check equity concentration
        if total_equity > total_portfolio * 0.7:
            rule_based.append({
                "type": "rule",
                "title": "High Equity Concentration",
                "description": "Consider adding debt/fixed income for stability",
                "asset_class": "Debt",
                "priority": 5,
                "reasoning": "Your portfolio has >70% equity exposure, increasing risk."
            })
        
        # AI-powered recommendations using GPT
        try:
            portfolio_summary = {
                "total_value": total_portfolio,
                "equity_pct": (total_equity / total_portfolio * 100) if total_portfolio > 0 else 0,
                "mf_pct": (total_mf / total_portfolio * 100) if total_portfolio > 0 else 0,
                "other_pct": (total_other / total_portfolio * 100) if total_portfolio > 0 else 0,
                "holdings_count": len(holdings),
                "age_group": "25-30",  # Mock data
            }
            
            chat = LlmChat(
                api_key=os.environ.get("EMERGENT_LLM_KEY"),
                session_id=f"investment_rec_{user_id}",
                system_message="""You are a financial advisor specializing in Indian investments. 
                Analyze the portfolio and provide 2-3 specific, actionable investment recommendations.
                Focus on:
                - Asset allocation balance
                - Diversification opportunities  
                - Tax-saving instruments (80C, NPS)
                - Risk-adjusted returns
                
                Return recommendations in this JSON format:
                [
                    {
                        "title": "Short title",
                        "description": "1-2 sentence description",
                        "asset_class": "Asset class name",
                        "priority": 1-10 (higher is more important),
                        "reasoning": "Why this is recommended"
                    }
                ]
                
                Keep it practical and specific to Indian market."""
            ).with_model("openai", "gpt-5.1")
            
            prompt = f"""Analyze this investment portfolio and provide recommendations:
            
            Portfolio Summary:
            - Total Value: ₹{portfolio_summary['total_value']:,.2f}
            - Equity: {portfolio_summary['equity_pct']:.1f}%
            - Mutual Funds: {portfolio_summary['mf_pct']:.1f}%
            - Other (FD/Bonds/Crypto): {portfolio_summary['other_pct']:.1f}%
            - Number of Holdings: {portfolio_summary['holdings_count']}
            - Investor Age: {portfolio_summary['age_group']}
            
            Provide 2-3 specific recommendations."""
            
            from emergentintegrations.llm.chat import UserMessage
            response = await chat.send_message(UserMessage(text=prompt))
            
            # Parse AI response
            import json
            try:
                ai_recommendations = json.loads(response)
                for rec in ai_recommendations:
                    rec["type"] = "ai"
                    recommendations.append(rec)
            except:
                # If JSON parsing fails, create a default AI recommendation
                recommendations.append({
                    "type": "ai",
                    "title": "Portfolio Review",
                    "description": response[:150] + "...",
                    "asset_class": "General",
                    "priority": 8,
                    "reasoning": "AI-powered analysis"
                })
        
        except Exception as ai_error:
            logger.error(f"AI recommendation error: {ai_error}")
            # Continue with rule-based only
        
        # Merge recommendations (AI gets higher priority)
        recommendations.extend(rule_based)
        
        # Sort by priority (AI recommendations get +2 bonus)
        for rec in recommendations:
            if rec["type"] == "ai":
                rec["priority"] += 2
        
        recommendations.sort(key=lambda x: x["priority"], reverse=True)
        
        return recommendations[:5]  # Return top 5
        
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

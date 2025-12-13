from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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
async def get_category_breakdown(user_id: str, months: int = 1, month: Optional[int] = None, year: Optional[int] = None):
    """Get spending breakdown by category"""
    # If specific month and year provided, filter for that month only
    if month and year:
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
async def get_merchant_leaderboard(user_id: str, limit: int = 10, month: Optional[int] = None, year: Optional[int] = None):
    """Get top merchants by spending"""
    # If specific month and year provided, filter for that month only
    if month and year:
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
                "week_num": 5-i
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
            
            # Format: "Dec 24 - Jan 25"
            label = f"{month_names[start_month-1]} {str(start_year)[-2:]}"
            
            results.append({
                "month": label,
                "amount": amount,
                "period": f"{month_names[start_month-1]}-{month_names[(end_month-1)%12]}",
                "year": start_year
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

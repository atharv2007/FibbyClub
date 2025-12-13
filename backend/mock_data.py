from datetime import datetime, timedelta
from typing import List
import random

# Mock data for Indian Gen-Z finance app
CATEGORIES = [
    "Food & Dining", "Shopping", "Transport", "Entertainment", 
    "Utilities", "Healthcare", "Education", "Subscriptions",
    "Groceries", "Fitness", "Travel", "EMI"
]

MERCHANTS = {
    "Food & Dining": ["Zomato", "Swiggy", "Starbucks", "Domino's", "McDonald's", "KFC"],
    "Shopping": ["Amazon", "Flipkart", "Myntra", "Ajio", "H&M"],
    "Transport": ["Uber", "Ola", "Rapido", "BMTC", "Metro"],
    "Entertainment": ["Netflix", "Amazon Prime", "Hotstar", "BookMyShow", "Spotify"],
    "Utilities": ["BESCOM", "Airtel", "Jio", "Vi"],
    "Subscriptions": ["Netflix", "Spotify", "Amazon Prime", "YouTube Premium", "LinkedIn"],
    "Groceries": ["BigBasket", "Blinkit", "Zepto", "DMart"],
    "Fitness": ["Cult.fit", "Gold's Gym", "Decathlon"],
    "Travel": ["MakeMyTrip", "Goibibo", "Ola", "IRCTC"],
    "EMI": ["Bajaj Finserv", "HDFC EMI", "Amazon Pay Later"]
}

INSIGHTS_TEMPLATES = [
    {
        "type": "alert",
        "template": "Netflix price hike detected. New plan: ₹{amount}",
        "category": "Subscriptions"
    },
    {
        "type": "habit",
        "template": "Zomato order #{count} this week. Ghar ka khana? 🍛",
        "category": "Food & Dining"
    },
    {
        "type": "habit",
        "template": "You've spent ₹{amount} on coffee this month. That's {count} cups! ☕",
        "category": "Food & Dining"
    },
    {
        "type": "alert",
        "template": "Budget alert! You've crossed 80% of your {category} budget",
        "category": "Shopping"
    },
    {
        "type": "tip",
        "template": "Save ₹{amount} by switching to annual subscription!",
        "category": "Subscriptions"
    },
    {
        "type": "achievement",
        "template": "Yay! You saved ₹{amount} this month 🎉",
        "category": None
    }
]


def generate_mock_user():
    """Generate mock user data"""
    return {
        "name": "Mohit",
        "email": "mohit@example.com",
        "avatar": None,
        "location": "Bangalore",
        "hinglish_mode": True,
        "dark_mode": False,
        "biometric_lock": False
    }


def generate_mock_bank_account(user_id: str):
    """Generate HDFC bank account"""
    return {
        "user_id": user_id,
        "bank_name": "HDFC Bank",
        "bank_logo": None,
        "account_number": "XXXX4567",
        "account_type": "Savings",
        "balance": 24540.0,
        "currency": "INR",
        "last_updated": datetime.utcnow(),
        "status": "active",
        "consent_given": True
    }


def generate_mock_transactions(user_id: str, account_id: str, num_months: int = 3) -> List[dict]:
    """Generate realistic transaction history for Indian Gen-Z"""
    transactions = []
    current_date = datetime.utcnow()
    
    for month_offset in range(num_months):
        month_start = current_date - timedelta(days=30 * month_offset)
        
        # Generate 20-30 transactions per month
        num_transactions = random.randint(20, 30)
        
        for _ in range(num_transactions):
            # Random day in the month
            days_back = random.randint(0, 30)
            transaction_date = month_start - timedelta(days=days_back)
            
            # Weighted category selection (more food and shopping)
            category = random.choices(
                CATEGORIES,
                weights=[30, 20, 15, 10, 5, 3, 3, 8, 12, 5, 5, 4],
                k=1
            )[0]
            
            # Select merchant
            merchant = random.choice(MERCHANTS.get(category, ["Unknown"]))
            
            # Generate realistic amounts
            if category == "EMI":
                amount = random.choice([2500, 3000, 5000, 7500])
            elif category in ["Food & Dining", "Groceries"]:
                amount = round(random.uniform(150, 1200), 2)
            elif category == "Shopping":
                amount = round(random.uniform(500, 5000), 2)
            elif category == "Transport":
                amount = round(random.uniform(50, 500), 2)
            elif category == "Subscriptions":
                amount = random.choice([199, 299, 499, 999, 1499])
            else:
                amount = round(random.uniform(100, 2000), 2)
            
            transactions.append({
                "user_id": user_id,
                "account_id": account_id,
                "amount": amount,
                "category": category,
                "merchant": merchant,
                "description": f"{merchant} payment",
                "transaction_type": "expense",
                "date": transaction_date,
                "payment_mode": random.choice(["UPI", "Card", "Net Banking"])
            })
    
    # Add some income transactions
    for month_offset in range(num_months):
        month_start = current_date - timedelta(days=30 * month_offset)
        transactions.append({
            "user_id": user_id,
            "account_id": account_id,
            "amount": 45000.0,
            "category": "Salary",
            "merchant": "Company Inc",
            "description": "Monthly Salary",
            "transaction_type": "income",
            "date": month_start - timedelta(days=1),
            "payment_mode": "NEFT"
        })
    
    return sorted(transactions, key=lambda x: x["date"], reverse=True)


def generate_mock_goals(user_id: str) -> List[dict]:
    """Generate mock financial goals"""
    return [
        {
            "user_id": user_id,
            "name": "Goa Trip",
            "icon": "airplane",
            "target_amount": 30000.0,
            "saved_amount": 12500.0,
            "deadline": datetime.utcnow() + timedelta(days=90),
            "auto_save_enabled": True,
            "auto_save_amount": 1000.0
        },
        {
            "user_id": user_id,
            "name": "New Laptop",
            "icon": "laptop",
            "target_amount": 75000.0,
            "saved_amount": 25000.0,
            "deadline": datetime.utcnow() + timedelta(days=180),
            "auto_save_enabled": False,
            "auto_save_amount": None
        },
        {
            "user_id": user_id,
            "name": "Emergency Fund",
            "icon": "shield-checkmark",
            "target_amount": 100000.0,
            "saved_amount": 45000.0,
            "deadline": None,
            "auto_save_enabled": True,
            "auto_save_amount": 2000.0
        },
        {
            "user_id": user_id,
            "name": "Dream Car",
            "icon": "car-sport",
            "target_amount": 500000.0,
            "saved_amount": 150000.0,
            "deadline": datetime.utcnow() + timedelta(days=730),
            "auto_save_enabled": True,
            "auto_save_amount": 5000.0
        },
        {
            "user_id": user_id,
            "name": "New iPhone",
            "icon": "phone-portrait",
            "target_amount": 120000.0,
            "saved_amount": 85000.0,
            "deadline": datetime.utcnow() + timedelta(days=120),
            "auto_save_enabled": False,
            "auto_save_amount": None
        },
        {
            "user_id": user_id,
            "name": "Home Down Payment",
            "icon": "home",
            "target_amount": 1500000.0,
            "saved_amount": 320000.0,
            "deadline": datetime.utcnow() + timedelta(days=1095),
            "auto_save_enabled": True,
            "auto_save_amount": 10000.0
        },
        {
            "user_id": user_id,
            "name": "Wedding Fund",
            "icon": "heart",
            "target_amount": 800000.0,
            "saved_amount": 200000.0,
            "deadline": datetime.utcnow() + timedelta(days=900),
            "auto_save_enabled": True,
            "auto_save_amount": 8000.0
        },
        {
            "user_id": user_id,
            "name": "Study Abroad",
            "icon": "school",
            "target_amount": 2000000.0,
            "saved_amount": 450000.0,
            "deadline": datetime.utcnow() + timedelta(days=1460),
            "auto_save_enabled": True,
            "auto_save_amount": 15000.0
        }
    ]


def generate_mock_insights(user_id: str) -> List[dict]:
    """Generate mock insights and nudges"""
    insights = []
    current_date = datetime.utcnow()
    
    # Recent insights
    insights.append({
        "user_id": user_id,
        "type": "alert",
        "message": "Netflix price hike detected. New plan: ₹649",
        "category": "Subscriptions",
        "amount": 649.0,
        "date": current_date - timedelta(days=1),
        "is_read": False
    })
    
    insights.append({
        "user_id": user_id,
        "type": "habit",
        "message": "Zomato order #4 this week. Ghar ka khana? 🍛",
        "category": "Food & Dining",
        "amount": None,
        "date": current_date - timedelta(days=2),
        "is_read": False
    })
    
    insights.append({
        "user_id": user_id,
        "type": "tip",
        "message": "You can save ₹2,400 by switching to annual Spotify!",
        "category": "Subscriptions",
        "amount": 2400.0,
        "date": current_date - timedelta(days=3),
        "is_read": False
    })
    
    insights.append({
        "user_id": user_id,
        "type": "achievement",
        "message": "Relax bro! You're 20% under budget this month 📈",
        "category": None,
        "amount": None,
        "date": current_date - timedelta(days=5),
        "is_read": True
    })
    
    return insights

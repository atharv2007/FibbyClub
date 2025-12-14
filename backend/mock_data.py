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
        "phone": "+919876543210",
        "pan_card": "ABCDE1234F",
        "avatar": None,
        "location": "Bangalore",
        "hinglish_mode": True,
        "dark_mode": False,
        "biometric_lock": False
    }


# Mock user data for authentication
MOCK_USERS = {
    "mohit@example.com": {
        "name": "Mohit",
        "email": "mohit@example.com",
        "phone": "+919876543210",
        "pan_card": "ABCDE1234F"
    },
    "+919876543210": {
        "name": "Mohit",
        "email": "mohit@example.com",
        "phone": "+919876543210",
        "pan_card": "ABCDE1234F"
    }
}

# Mock Account Aggregator data - Banks by PAN
MOCK_AA_DATA = {
    "CTHPG0072G": [
        {
            "bank_name": "ICICI Bank",
            "account_number": "XXXX8901",
            "account_type": "Savings",
            "balance": 45230.50,
            "ifsc": "ICIC0001234"
        },
        {
            "bank_name": "HDFC Bank",
            "account_number": "XXXX4567",
            "account_type": "Savings",
            "balance": 82750.00,
            "ifsc": "HDFC0001234"
        }
    ],
    "ABCDE1234F": [
        {
            "bank_name": "HDFC Bank",
            "account_number": "XXXX4567",
            "account_type": "Savings",
            "balance": 24540.00,
            "ifsc": "HDFC0001234"
        },
        {
            "bank_name": "ICICI Bank",
            "account_number": "XXXX8901",
            "account_type": "Savings",
            "balance": 45230.50,
            "ifsc": "ICIC0001234"
        },
        {
            "bank_name": "State Bank of India",
            "account_number": "XXXX2345",
            "account_type": "Savings",
            "balance": 28750.00,
            "ifsc": "SBIN0001234"
        },
        {
            "bank_name": "Axis Bank",
            "account_number": "XXXX6789",
            "account_type": "Current",
            "balance": 67890.25,
            "ifsc": "UTIB0001234"
        }
    ]
}


def get_banks_by_pan(pan_card: str) -> List[dict]:
    """Get banks associated with PAN card (mock Account Aggregator)"""
    return MOCK_AA_DATA.get(pan_card, [])


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


# ============= CREDIT SCORE & CARDS DATA =============

def generate_credit_score_data(user_id: str):
    """Generate mock credit score and factors"""
    return {
        "user_id": user_id,
        "score": 728,  # Good credit score
        "score_range": "Good",
        "last_updated": datetime.utcnow(),
        "factors": [
            {
                "name": "Payment History",
                "impact": "High",
                "value": 85,
                "status": "excellent",
                "description": "You've paid 95% of your bills on time in the last 12 months",
                "tip": "Keep paying on time to maintain this excellent record"
            },
            {
                "name": "Credit Utilization",
                "impact": "High",
                "value": 42,
                "status": "good",
                "description": "You're using 42% of your available credit (₹42,000 of ₹1,00,000)",
                "tip": "Try to keep usage below 30% for optimal score"
            },
            {
                "name": "Credit Age",
                "impact": "Medium",
                "value": 65,
                "status": "fair",
                "description": "Average credit account age: 2 years 4 months",
                "tip": "Keep older accounts active to improve this factor"
            },
            {
                "name": "Credit Mix",
                "impact": "Low",
                "value": 70,
                "status": "good",
                "description": "You have 2 credit cards and 1 personal loan",
                "tip": "Good mix of credit types"
            },
            {
                "name": "Hard Inquiries",
                "impact": "Low",
                "value": 80,
                "status": "good",
                "description": "2 credit inquiries in the last 6 months",
                "tip": "Avoid multiple credit applications in short period"
            }
        ]
    }


def generate_credit_cards():
    """Generate mock credit cards with reward features"""
    return [
        {
            "_id": "cc1",
            "card_name": "HDFC MoneyBack+",
            "card_type": "Credit Card",
            "bank": "HDFC Bank",
            "last_four": "4567",
            "credit_limit": 50000,
            "available_credit": 32000,
            "outstanding": 18000,
            "due_date": (datetime.utcnow() + timedelta(days=12)).isoformat(),
            "reward_points": 4250,
            "features": [
                {
                    "icon": "gift",
                    "title": "Cashback",
                    "value": "5% on groceries",
                    "description": "Earn 5% cashback on all grocery purchases including BigBasket, Blinkit, and Zepto. No minimum spend required. Maximum cashback: ₹500/month."
                },
                {
                    "icon": "restaurant",
                    "title": "Dining",
                    "value": "10x rewards",
                    "description": "Get 10x reward points on dining at Zomato, Swiggy, and partner restaurants. Points never expire and can be redeemed for flights, vouchers, or statement credit."
                },
                {
                    "icon": "airplane",
                    "title": "Travel Benefits",
                    "value": "2 lounge access/year",
                    "description": "Complimentary airport lounge access at 1000+ lounges worldwide. Valid for both domestic and international travel. Guest access not included."
                },
                {
                    "icon": "shield-checkmark",
                    "title": "Insurance",
                    "value": "₹10L cover",
                    "description": "Complimentary air accident insurance cover of ₹10 lakhs. Also includes lost card liability protection and fraud protection on online transactions."
                }
            ]
        },
        {
            "_id": "cc2",
            "card_name": "Amazon Pay ICICI",
            "card_type": "Credit Card",
            "bank": "ICICI Bank",
            "last_four": "8901",
            "credit_limit": 80000,
            "available_credit": 68000,
            "outstanding": 12000,
            "due_date": (datetime.utcnow() + timedelta(days=18)).isoformat(),
            "reward_points": 8420,
            "features": [
                {
                    "icon": "cart",
                    "title": "Amazon Rewards",
                    "value": "5% back on Amazon",
                    "description": "Unlimited 5% back on Amazon.in for Prime members, 3% for non-Prime. Applies to all categories except jewelry and Amazon Pay balance loads."
                },
                {
                    "icon": "wallet",
                    "title": "Amazon Pay",
                    "value": "2% on all spends",
                    "description": "Earn 2% back when you pay using Amazon Pay at partner merchants. Includes bill payments, recharges, and e-commerce sites."
                },
                {
                    "icon": "card",
                    "title": "Welcome Bonus",
                    "value": "₹500 voucher",
                    "description": "Get ₹500 Amazon gift voucher on first transaction. Plus earn 5000 bonus points on spending ₹40,000 in first 90 days."
                },
                {
                    "icon": "pricetag",
                    "title": "Fuel Surcharge",
                    "value": "1% waiver",
                    "description": "Save 1% fuel surcharge at all fuel stations across India. Valid on transactions between ₹400 to ₹4000. Maximum savings: ₹250/month."
                }
            ]
        }
    ]


def generate_credit_transactions(user_id: str):
    """Generate mock credit card transactions"""
    transactions = []
    categories = ["Food & Dining", "Shopping", "Entertainment", "Utilities", "Groceries", "Travel", "Fuel"]
    
    for i in range(30):
        days_ago = random.randint(0, 60)
        category = random.choice(categories)
        
        merchants = {
            "Food & Dining": ["Zomato", "Swiggy", "Starbucks", "Domino's"],
            "Shopping": ["Amazon", "Flipkart", "Myntra"],
            "Entertainment": ["Netflix", "BookMyShow", "Spotify"],
            "Utilities": ["Airtel", "Jio", "BESCOM"],
            "Groceries": ["BigBasket", "Blinkit", "DMart"],
            "Travel": ["Uber", "Ola", "MakeMyTrip"],
            "Fuel": ["HP", "Indian Oil", "Shell"]
        }
        
        merchant = random.choice(merchants[category])
        amount = round(random.uniform(150, 5000), 2)
        
        transactions.append({
            "user_id": user_id,
            "card_id": random.choice(["cc1", "cc2"]),
            "merchant": merchant,
            "category": category,
            "amount": amount,
            "date": (datetime.utcnow() - timedelta(days=days_ago)).isoformat(),
            "status": "completed",
            "reward_points": int(amount * 0.02) if random.random() > 0.3 else 0
        })
    
    return sorted(transactions, key=lambda x: x['date'], reverse=True)


def generate_credit_recommendations():
    """Generate AI recommendations for credit improvement"""
    return [
        {
            "title": "Pay Down High-Utilization Card",
            "category": "Credit Score",
            "priority": "high",
            "description": "Your HDFC MoneyBack+ is at 36% utilization. Paying ₹5,000 extra this month could boost your score by 8-12 points.",
            "action": "Pay ₹5,000 now",
            "icon": "trending-up",
            "color": "#10B981"
        },
        {
            "title": "Upgrade to Premium Card",
            "category": "Card Suggestion",
            "priority": "medium",
            "description": "With your improved score (728), you now qualify for HDFC Regalia with better rewards: 4 reward points per ₹150 and 12 airport lounge visits/year.",
            "action": "Check eligibility",
            "icon": "card",
            "color": "#6366F1"
        },
        {
            "title": "Set Up AutoPay",
            "category": "Payment",
            "priority": "medium",
            "description": "Automate your credit card payments to never miss due dates. This can improve your payment history factor by 15%.",
            "action": "Enable AutoPay",
            "icon": "time",
            "color": "#F59E0B"
        },
        {
            "title": "Consolidate Small EMIs",
            "category": "Debt Management",
            "priority": "low",
            "description": "You have 3 small EMIs totaling ₹8,500/month. Consider a personal loan at 11.5% APR to save ₹1,200/month and simplify payments.",
            "action": "View offers",
            "icon": "calculator",
            "color": "#8B5CF6"
        }
    ]

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

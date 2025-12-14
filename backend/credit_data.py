from datetime import datetime, timedelta
import random

def generate_credit_score_data(user_id: str):
    """Generate mock credit score and factors"""
    return {
        "user_id": user_id,
        "score": 728,
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

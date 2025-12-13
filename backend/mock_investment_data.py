from datetime import datetime, timedelta
from typing import List
import random

# Mock Investment Data Generator (Based on Zerodha Kite API)

# Stock Holdings (NSE/BSE)
MOCK_HOLDINGS = [
    {
        "tradingsymbol": "RELIANCE",
        "exchange": "NSE",
        "instrument_token": 738561,
        "isin": "INE002A01018",
        "quantity": 10,
        "average_price": 2600.50,
        "last_price": 2750.00,
        "close_price": 2745.00,
    },
    {
        "tradingsymbol": "TCS",
        "exchange": "NSE",
        "instrument_token": 2953217,
        "isin": "INE467B01029",
        "quantity": 5,
        "average_price": 3850.00,
        "last_price": 4025.50,
        "close_price": 4020.00,
    },
    {
        "tradingsymbol": "INFY",
        "exchange": "NSE",
        "instrument_token": 408065,
        "isin": "INE009A01021",
        "quantity": 15,
        "average_price": 1520.00,
        "last_price": 1685.75,
        "close_price": 1680.00,
    },
    {
        "tradingsymbol": "HDFCBANK",
        "exchange": "NSE",
        "instrument_token": 341249,
        "isin": "INE040A01034",
        "quantity": 8,
        "average_price": 1650.00,
        "last_price": 1725.50,
        "close_price": 1720.00,
    },
    {
        "tradingsymbol": "SBIN",
        "exchange": "NSE",
        "instrument_token": 779521,
        "isin": "INE062A01020",
        "quantity": 25,
        "average_price": 650.00,
        "last_price": 762.45,
        "close_price": 766.40,
    },
    {
        "tradingsymbol": "TATAMOTORS",
        "exchange": "NSE",
        "instrument_token": 884737,
        "isin": "INE155A01022",
        "quantity": 20,
        "average_price": 850.00,
        "last_price": 925.80,
        "close_price": 920.00,
    },
]

# Mutual Funds
MOCK_MUTUAL_FUNDS = [
    {
        "folio": "3108290884",
        "fund": "ICICI Prudential Bluechip Fund - Direct Plan",
        "tradingsymbol": "INF109K01VF0",
        "quantity": 450.25,
        "average_price": 65.50,
        "last_price": 78.43,
        "is_sip": True,
        "sip_amount": 5000,
        "sip_date": 5,
    },
    {
        "folio": "5102495241",
        "fund": "SBI Equity Hybrid Fund - Direct Plan",
        "tradingsymbol": "INF200K01VZ3",
        "quantity": 120.50,
        "average_price": 180.00,
        "last_price": 195.50,
        "is_sip": True,
        "sip_amount": 3000,
        "sip_date": 10,
    },
    {
        "folio": "9104386836",
        "fund": "Axis Long Term Equity Fund - Direct Plan",
        "tradingsymbol": "INF846K01DP2",
        "quantity": 85.75,
        "average_price": 95.00,
        "last_price": 108.25,
        "is_sip": True,
        "sip_amount": 2000,
        "sip_date": 1,
    },
    {
        "folio": "7102345678",
        "fund": "Mirae Asset Large Cap Fund - Direct Plan",
        "tradingsymbol": "INF769K01FN2",
        "quantity": 200.00,
        "average_price": 72.00,
        "last_price": 85.50,
        "is_sip": False,
        "sip_amount": None,
        "sip_date": None,
    },
]

# Other Investments
MOCK_CRYPTO = [
    {
        "type": "crypto",
        "name": "Bitcoin (BTC)",
        "amount_invested": 50000,
        "current_value": 62500,
        "metadata": {"units": 0.0012, "platform": "WazirX"}
    },
    {
        "type": "crypto",
        "name": "Ethereum (ETH)",
        "amount_invested": 30000,
        "current_value": 34500,
        "metadata": {"units": 0.18, "platform": "CoinDCX"}
    },
]

MOCK_FDS = [
    {
        "type": "fd",
        "name": "HDFC Bank FD",
        "amount_invested": 100000,
        "current_value": 108500,
        "interest_rate": 6.8,
        "maturity_date": datetime.utcnow() + timedelta(days=365),
        "metadata": {"tenure_months": 12, "bank": "HDFC Bank"}
    },
    {
        "type": "fd",
        "name": "SBI FD",
        "amount_invested": 50000,
        "current_value": 54250,
        "interest_rate": 7.0,
        "maturity_date": datetime.utcnow() + timedelta(days=730),
        "metadata": {"tenure_months": 24, "bank": "State Bank of India"}
    },
]

MOCK_BONDS = [
    {
        "type": "bond",
        "name": "REC Bonds 2024",
        "amount_invested": 25000,
        "current_value": 26500,
        "interest_rate": 7.5,
        "maturity_date": datetime.utcnow() + timedelta(days=1825),
        "metadata": {"bond_type": "Government", "issuer": "REC"}
    },
]

MOCK_REAL_ESTATE = [
    {
        "type": "real_estate",
        "name": "Fractional RE - Mumbai",
        "amount_invested": 250000,
        "current_value": 275000,
        "metadata": {"platform": "Strata", "location": "Andheri, Mumbai", "property_type": "Commercial"}
    },
]

MOCK_NPS = [
    {
        "type": "nps",
        "name": "NPS Tier 1",
        "amount_invested": 75000,
        "current_value": 82500,
        "metadata": {"pran": "1234567890", "fund_manager": "HDFC Pension"}
    },
]

MOCK_PPF = [
    {
        "type": "ppf",
        "name": "PPF Account",
        "amount_invested": 150000,
        "current_value": 165000,
        "interest_rate": 7.1,
        "maturity_date": datetime.utcnow() + timedelta(days=3650),
        "metadata": {"account_number": "PPF123456", "bank": "SBI"}
    },
]

MOCK_INSURANCE = [
    {
        "type": "insurance",
        "name": "HDFC Life Sanchay Plus",
        "amount_invested": 120000,
        "current_value": 132000,
        "maturity_date": datetime.utcnow() + timedelta(days=3650),
        "metadata": {"policy_number": "POL123456", "sum_assured": 500000, "type": "ULIP"}
    },
]


def generate_mock_holdings(user_id: str) -> List[dict]:
    """Generate mock stock holdings"""
    holdings = []
    for holding in MOCK_HOLDINGS:
        pnl = (holding["last_price"] - holding["average_price"]) * holding["quantity"]
        day_change = holding["last_price"] - holding["close_price"]
        day_change_percentage = (day_change / holding["close_price"]) * 100 if holding["close_price"] > 0 else 0
        
        holdings.append({
            "user_id": user_id,
            "tradingsymbol": holding["tradingsymbol"],
            "exchange": holding["exchange"],
            "instrument_token": holding["instrument_token"],
            "isin": holding["isin"],
            "product": "CNC",
            "quantity": holding["quantity"],
            "average_price": holding["average_price"],
            "last_price": holding["last_price"],
            "close_price": holding["close_price"],
            "pnl": round(pnl, 2),
            "day_change": round(day_change, 2),
            "day_change_percentage": round(day_change_percentage, 2),
        })
    
    return holdings


def generate_mock_mutual_funds(user_id: str) -> List[dict]:
    """Generate mock mutual fund holdings"""
    funds = []
    for fund in MOCK_MUTUAL_FUNDS:
        pnl = (fund["last_price"] - fund["average_price"]) * fund["quantity"]
        
        funds.append({
            "user_id": user_id,
            "folio": fund["folio"],
            "fund": fund["fund"],
            "tradingsymbol": fund["tradingsymbol"],
            "quantity": fund["quantity"],
            "average_price": fund["average_price"],
            "last_price": fund["last_price"],
            "pnl": round(pnl, 2),
            "is_sip": fund["is_sip"],
            "sip_amount": fund["sip_amount"],
            "sip_date": fund["sip_date"],
        })
    
    return funds


def generate_mock_other_investments(user_id: str) -> List[dict]:
    """Generate all other investment types"""
    investments = []
    
    # Crypto
    for crypto in MOCK_CRYPTO:
        returns = crypto["current_value"] - crypto["amount_invested"]
        returns_pct = (returns / crypto["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": crypto["type"],
            "name": crypto["name"],
            "amount_invested": crypto["amount_invested"],
            "current_value": crypto["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": None,
            "interest_rate": None,
            "metadata": crypto["metadata"],
        })
    
    # FDs
    for fd in MOCK_FDS:
        returns = fd["current_value"] - fd["amount_invested"]
        returns_pct = (returns / fd["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": fd["type"],
            "name": fd["name"],
            "amount_invested": fd["amount_invested"],
            "current_value": fd["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": fd["maturity_date"],
            "interest_rate": fd["interest_rate"],
            "metadata": fd["metadata"],
        })
    
    # Bonds
    for bond in MOCK_BONDS:
        returns = bond["current_value"] - bond["amount_invested"]
        returns_pct = (returns / bond["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": bond["type"],
            "name": bond["name"],
            "amount_invested": bond["amount_invested"],
            "current_value": bond["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": bond["maturity_date"],
            "interest_rate": bond["interest_rate"],
            "metadata": bond["metadata"],
        })
    
    # Real Estate
    for re in MOCK_REAL_ESTATE:
        returns = re["current_value"] - re["amount_invested"]
        returns_pct = (returns / re["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": re["type"],
            "name": re["name"],
            "amount_invested": re["amount_invested"],
            "current_value": re["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": None,
            "interest_rate": None,
            "metadata": re["metadata"],
        })
    
    # NPS
    for nps in MOCK_NPS:
        returns = nps["current_value"] - nps["amount_invested"]
        returns_pct = (returns / nps["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": nps["type"],
            "name": nps["name"],
            "amount_invested": nps["amount_invested"],
            "current_value": nps["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": None,
            "interest_rate": None,
            "metadata": nps["metadata"],
        })
    
    # PPF
    for ppf in MOCK_PPF:
        returns = ppf["current_value"] - ppf["amount_invested"]
        returns_pct = (returns / ppf["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": ppf["type"],
            "name": ppf["name"],
            "amount_invested": ppf["amount_invested"],
            "current_value": ppf["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": ppf["maturity_date"],
            "interest_rate": ppf["interest_rate"],
            "metadata": ppf["metadata"],
        })
    
    # Insurance
    for ins in MOCK_INSURANCE:
        returns = ins["current_value"] - ins["amount_invested"]
        returns_pct = (returns / ins["amount_invested"]) * 100
        investments.append({
            "user_id": user_id,
            "type": ins["type"],
            "name": ins["name"],
            "amount_invested": ins["amount_invested"],
            "current_value": ins["current_value"],
            "returns": returns,
            "returns_percentage": round(returns_pct, 2),
            "maturity_date": ins["maturity_date"],
            "interest_rate": None,
            "metadata": ins["metadata"],
        })
    
    return investments

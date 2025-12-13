from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        return {"type": "string"}


# User Model
class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: str
    avatar: Optional[str] = None
    location: Optional[str] = None
    hinglish_mode: bool = True
    dark_mode: bool = False
    biometric_lock: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Bank Account Model
class BankAccount(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    bank_name: str
    bank_logo: Optional[str] = None
    account_number: str
    account_type: str = "Savings"
    balance: float
    currency: str = "INR"
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["active", "inactive", "pending"] = "active"
    consent_given: bool = True
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Transaction Model
class Transaction(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    account_id: str
    amount: float
    category: str
    merchant: str
    description: Optional[str] = None
    transaction_type: Literal["income", "expense"] = "expense"
    date: datetime
    payment_mode: Optional[str] = "UPI"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Goal Model
class Goal(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    name: str
    icon: str
    target_amount: float
    saved_amount: float = 0.0
    deadline: Optional[datetime] = None
    auto_save_enabled: bool = False
    auto_save_amount: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Insight Model
class Insight(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    type: Literal["alert", "habit", "tip", "achievement"]
    message: str
    category: Optional[str] = None
    amount: Optional[float] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Chat Message Model
class ChatMessage(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    session_id: str
    role: Literal["user", "assistant"]
    content: str
    widget_data: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Request/Response Models
class UserCreate(BaseModel):
    name: str
    email: str
    location: Optional[str] = None


class BankAccountCreate(BaseModel):
    bank_name: str
    account_number: str
    balance: float


class TransactionCreate(BaseModel):
    account_id: str
    amount: float
    category: str
    merchant: str
    transaction_type: Literal["income", "expense"]
    date: datetime


class GoalCreate(BaseModel):
    name: str
    icon: str
    target_amount: float
    deadline: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    widget_data: Optional[dict] = None
    session_id: str


# Chat History Models
class ChatMessage(BaseModel):
    """Individual message in a conversation"""
    role: Literal["user", "assistant"]  # user or assistant (Fibby)
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    card_type: Optional[str] = None
    metrics: Optional[dict] = None


class ChatConversation(BaseModel):
    """Chat conversation/session"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    conversation_id: str  # Unique identifier for the conversation
    title: str  # Auto-generated or user-defined title
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# Investment Models (Zerodha Kite Structure)

class InvestmentHolding(BaseModel):
    """Stock/Equity Holdings"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    tradingsymbol: str
    exchange: str
    instrument_token: int
    isin: str
    product: str
    quantity: int
    average_price: float
    last_price: float
    close_price: float
    pnl: float
    day_change: float
    day_change_percentage: float
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MutualFund(BaseModel):
    """Mutual Fund Holdings"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    folio: str
    fund: str
    tradingsymbol: str  # ISIN
    quantity: float
    average_price: float
    last_price: float
    pnl: float
    is_sip: bool = False
    sip_amount: Optional[float] = None
    sip_date: Optional[int] = None  # Day of month
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class OtherInvestment(BaseModel):
    """Other Investment Types (FD, Bonds, Crypto, etc.)"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    type: Literal["crypto", "fd", "bond", "real_estate", "nps", "ppf", "insurance"]
    name: str
    amount_invested: float
    current_value: float
    returns: float
    returns_percentage: float
    maturity_date: Optional[datetime] = None
    interest_rate: Optional[float] = None
    metadata: Optional[dict] = None  # For type-specific data
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class InvestmentRecommendation(BaseModel):
    """Investment Recommendations"""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    type: Literal["ai", "rule"]
    title: str
    description: str
    asset_class: str
    priority: int = 0  # Higher = more important
    reasoning: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

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

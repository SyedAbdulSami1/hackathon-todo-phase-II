from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, create_engine
from pydantic import BaseModel, EmailStr



# Base model for database tables
class BaseSQLModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Database Models
class User(BaseSQLModel, table=True):
    __tablename__ = "users"

    username: str = Field(sa_column_kwargs={"unique": True}, index=True)
    email: EmailStr = Field(sa_column_kwargs={"unique": True}, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)

class Task(BaseSQLModel, table=True):
    __tablename__ = "tasks"

    title: str = Field(max_length=200, index=True)
    description: Optional[str] = Field(max_length=1000, default=None)
    status: str = Field(default="pending", index=True)  # pending, in_progress, completed
    user_id: int = Field(foreign_key="users.id", index=True)

# Pydantic Models for API
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
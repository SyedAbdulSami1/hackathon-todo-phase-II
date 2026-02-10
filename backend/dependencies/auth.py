from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session
from models import User, UserLogin, Token, TokenData, UserResponse, Role, Permission, RolePermission, UserRole
from db import get_session
import secrets

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY missing in .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# RBAC Configuration
ROLE_PERMISSIONS = {
    "student": [
        "read:tasks",
        "create:tasks",
        "update:own-tasks",
        "delete:own-tasks"
    ],
    "teacher": [
        "read:tasks",
        "create:tasks",
        "update:own-tasks",
        "delete:own-tasks",
        "update:all-tasks",
        "read:all-tasks"
    ],
    "admin": [
        "read:tasks",
        "create:tasks",
        "update:tasks",
        "delete:tasks",
        "read:users",
        "create:users",
        "update:users",
        "delete:users"
    ]
}

PERMISSION_ROUTES = {
    "read:tasks": ["GET /api/tasks"],
    "create:tasks": ["POST /api/tasks"],
    "update:tasks": [r"PUT /api/tasks/{\\d+}", r"PATCH /api/tasks/{\\d+}/status"],
    "delete:tasks": [r"DELETE /api/tasks/{\\d+}"],
    "read:users": [r"GET /api/auth/users", r"GET /api/auth/users/{\\d+}"],
    "create:users": [r"POST /api/auth/register", r"POST /api/auth/register-with-role"],
    "update:users": [r"PUT /api/auth/users/{\\d+}", r"PATCH /api/auth/users/{\\d+}"],
    "update:own-tasks": [r"PUT /api/tasks/{\\d+}", r"PATCH /api/tasks/{\\d+}/status"],
    "delete:own-tasks": [r"DELETE /api/tasks/{\\d+}"],
    "update:all-tasks": [r"PUT /api/tasks/{\\d+}", r"PATCH /api/tasks/{\\d+}/status"],
    "read:all-tasks": [r"GET /api/tasks"]
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user by username and password"""
    from sqlmodel import select
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    from sqlmodel import select
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def check_permission(user: User, permission: str) -> bool:
    """Check if user has specific permission"""
    user_permissions = ROLE_PERMISSIONS.get(user.role, [])
    return permission in user_permissions

async def require_permission(permission: str):
    """Dependency to require specific permission"""
    async def dependency(
        current_user: User = Depends(get_current_active_user)
    ):
        if not check_permission(current_user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission}"
            )
        return current_user
    return dependency

def get_role_permissions(role: str) -> list:
    """Get permissions for specific role"""
    return ROLE_PERMISSIONS.get(role, [])
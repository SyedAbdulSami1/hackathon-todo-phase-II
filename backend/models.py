from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel, EmailStr
import secrets

# Base model for database tables
class BaseSQLModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True})
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Database Models
class User(BaseSQLModel, table=True):
    __tablename__ = "users"

    username: str = Field(sa_column_kwargs={"unique": True}, index=True)
    email: EmailStr = Field(sa_column_kwargs={"unique": True}, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    role: str = Field(default="student", index=True)  # student, teacher, admin
    last_login: Optional[datetime] = Field(default=None)
    password_reset_token: Optional[str] = Field(default=None)
    password_reset_token_expiry: Optional[datetime] = Field(default=None)

# RBAC Models
class Role(BaseSQLModel, table=True):
    __tablename__ = "roles"

    name: str = Field(sa_column_kwargs={"unique": True}, index=True)
    description: str

class Permission(BaseSQLModel, table=True):
    __tablename__ = "permissions"

    name: str = Field(sa_column_kwargs={"unique": True}, index=True)
    description: str

class RolePermission(BaseSQLModel, table=True):
    __tablename__ = "role_permissions"

    role_id: int = Field(foreign_key="roles.id", index=True)
    permission_id: int = Field(foreign_key="permissions.id", index=True)

class UserRole(BaseSQLModel, table=True):
    __tablename__ = "user_roles"

    user_id: int = Field(foreign_key="users.id", index=True)
    role_id: int = Field(foreign_key="roles.id", index=True)

# Pydantic Models for API
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = Field(default="student")

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None)
    email: Optional[EmailStr] = Field(None)
    password: Optional[str] = Field(None)
    role: Optional[str] = Field(None)
    is_active: Optional[bool] = Field(None)

class RoleResponse(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class RolePermissionResponse(BaseModel):
    role_id: int
    permission_id: int
    role: RoleResponse
    permission: PermissionResponse

    class Config:
        from_attributes = True

class UserRoleResponse(BaseModel):
    user_id: int
    role_id: int
    user: UserResponse
    role: RoleResponse

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    role: str
    last_login: Optional[datetime]
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
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: str = Field("pending", regex="^(pending|in_progress|completed)$")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[str] = Field(None, regex="^(pending|in_progress|completed)$")

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

class TaskDeleteResponse(BaseModel):
    message: str
    deleted_task_id: int
    deleted_at: datetime

class TaskStatusResponse(BaseModel):
    message: str
    task_id: int
    old_status: str
    new_status: str
    updated_at: datetime

class TaskCreateResponse(BaseModel):
    message: str
    task: TaskResponse
    created_at: datetime

class PermissionResponse(BaseModel):
    name: str
    description: str

class RolePermissions(BaseModel):
    role: str
    permissions: List[str]

class PermissionCheck(BaseModel):
    permission: str
    has_permission: bool

class PermissionResponse(BaseModel):
    name: str
    description: str

class RolePermissions(BaseModel):
    role: str
    permissions: List[str]

class PermissionCheck(BaseModel):
    permission: str
    has_permission: bool

# RBAC Models
class Role(BaseSQLModel, table=True):
    __tablename__ = "roles"

    name: str = Field(sa_column_kwargs={"unique": True}, index=True)
    description: str

class Permission(BaseSQLModel, table=True):
    __tablename__ = "permissions"

    name: str = Field(sa_column_kwargs={"unique": True}, index=True)
    description: str

class RolePermission(BaseSQLModel, table=True):
    __tablename__ = "role_permissions"

    role_id: int = Field(foreign_key="roles.id", index=True)
    permission_id: int = Field(foreign_key="permissions.id", index=True)

class UserRole(BaseSQLModel, table=True):
    __tablename__ = "user_roles"

    user_id: int = Field(foreign_key="users.id", index=True)
    role_id: int = Field(foreign_key="roles.id", index=True)

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
    role: Optional[str] = Field(default="student")

class RoleResponse(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class PermissionResponse(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class RolePermissionResponse(BaseModel):
    role_id: int
    permission_id: int
    role: RoleResponse
    permission: PermissionResponse

    class Config:
        from_attributes = True

class UserRoleResponse(BaseModel):
    user_id: int
    role_id: int
    user: UserResponse
    role: RoleResponse

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    role: str
    last_login: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: str = Field("pending", regex="^(pending|in_progress|completed)$")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[str] = Field(None, regex="^(pending|in_progress|completed)$")

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

class TaskDeleteResponse(BaseModel):
    message: str
    deleted_task_id: int
    deleted_at: datetime

class TaskStatusResponse(BaseModel):
    message: str
    task_id: int
    old_status: str
    new_status: str
    updated_at: datetime

class TaskCreateResponse(BaseModel):
    message: str
    task: TaskResponse
    created_at: datetime
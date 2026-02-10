from sqlmodel import SQLModel, create_engine, Session
import os
from models import User, Role, Permission, RolePermission, UserRole

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:your_password@localhost/todo_db")

# Create SQLModel engine
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Disable query logging for now
    pool_pre_ping=True,  # Enable connection health checks
    pool_size=5,
    max_overflow=10
)

def get_session():
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session

def init_db():
    """Initialize database tables"""
    SQLModel.metadata.create_all(engine)

def seed_demo_users():
    """Seed demo users and RBAC permissions"""
    with Session(engine) as session:
        # Create roles if they don't exist
        roles_to_create = ["student", "teacher", "admin"]
        for role_name in roles_to_create:
            existing_role = session.exec(select(Role).where(Role.name == role_name)).first()
            if not existing_role:
                db_role = Role(name=role_name, description=f"{role_name.capitalize()} role")
                session.add(db_role)

        # Create permissions if they don't exist
        permissions_to_create = [
            "read:tasks", "create:tasks", "update:tasks", "delete:tasks",
            "read:users", "create:users", "update:users", "delete:users",
            "update:own-tasks", "delete:own-tasks", "update:all-tasks", "read:all-tasks"
        ]
        for perm_name in permissions_to_create:
            existing_perm = session.exec(select(Permission).where(Permission.name == perm_name)).first()
            if not existing_perm:
                db_perm = Permission(name=perm_name, description=f"Permission to {perm_name}")
                session.add(db_perm)

        # Create demo users
        demo_users = [
            {"username": "ali", "password": "pass123", "email": "ali@example.com", "role": "student"},
            {"username": "sir_ahmed", "password": "pass123", "email": "sir_ahmed@example.com", "role": "teacher"},
            {"username": "boss", "password": "pass123", "email": "boss@example.com", "role": "admin"}
        ]

        for user_data in demo_users:
            existing_user = session.exec(
                select(User).where((User.username == user_data["username"]) | (User.email == user_data["email"]))
            ).first()
            if not existing_user:
                from dependencies.auth import get_password_hash
                hashed_password = get_password_hash(user_data["password"])
                db_user = User(
                    username=user_data["username"],
                    email=user_data["email"],
                    hashed_password=hashed_password,
                    role=user_data["role"],
                    is_active=True
                )
                session.add(db_user)

        session.commit()

def get_secret_key():
    """Get or generate SECRET_KEY"""
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        import secrets
        secret_key = secrets.token_hex(32)
        # For production, you should set this in .env file
        print(f"Generated SECRET_KEY: {secret_key}")
    return secret_key
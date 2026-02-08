from sqlmodel import SQLModel, create_engine, Session
import os

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
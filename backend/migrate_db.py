"""Database migration script to update schema"""
from sqlmodel import create_engine, text
from db import DATABASE_URL
import os

def create_migration():
    """Create database migration"""
    # Initialize database
    engine = create_engine(DATABASE_URL)
    
    # Check if role column exists, if not create it
    with engine.connect() as conn:
        # Check if role column exists in users table
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'
        """))
        
        if not result.fetchone():
            # Add role column to users table
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'student';"))
            conn.execute(text("CREATE INDEX ix_users_role ON users (role);"))
            print("Added 'role' column to users table")
        else:
            print("'role' column already exists in users table")
            
        # Commit the transaction
        conn.commit()
    
    print("Database schema updated successfully!")

if __name__ == "__main__":
    create_migration()
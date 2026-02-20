from sqlmodel import Session, create_engine, select
from models import User, BaseSQLModel
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def test_manual_register():
    print(f"Connecting to: {DATABASE_URL}")
    with Session(engine) as session:
        # Check if table exists by trying a simple select
        try:
            statement = select(User).limit(1)
            results = session.exec(statement).all()
            print("Successfully queried users table.")
            
            # Create a test user
            test_user = User(
                username="testuser_debug",
                email="test_debug@example.com",
                hashed_password="fakehash"
            )
            session.add(test_user)
            session.commit()
            print("Successfully added a test user.")
            
            # Clean up
            session.delete(test_user)
            session.commit()
            print("Successfully cleaned up test user.")
            
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    test_manual_register()

import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

def check_tables():
    # Load environment variables from .env file in the current directory
    # This assumes the script is run from the 'backend' directory
    load_dotenv()

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        print("ERROR: DATABASE_URL environment variable is not set. Make sure your .env file is correct.")
        return

    try:
        print("Connecting to the database...")
        # echo=False to keep the output clean
        engine = create_engine(DATABASE_URL, echo=False)

        with engine.connect() as connection:
            print("Connection successful.")
            inspector = inspect(engine)

            print("Fetching list of tables...")
            tables = inspector.get_table_names()

            if not tables:
                print("\n❌ FAILED: No tables were found in the database.")
                print("The migration script likely did not complete successfully.")
                return

            print("\nTables found in your Neon database:")
            for table in tables:
                print(f"- {table}")

            print("\nVerification:")
            if "users" in tables and "tasks" in tables:
                print("✅ SUCCESS: Both 'users' and 'tasks' tables exist.")
            else:
                print("❌ FAILED: One or both of the required tables ('users', 'tasks') are missing.")

    except Exception as e:
        print(f"\nAn error occurred while connecting or inspecting the database: {e}")
        print("\nPlease double-check your DATABASE_URL in the .env file and ensure the Neon DB is active and accessible.")

if __name__ == "__main__":
    check_tables()

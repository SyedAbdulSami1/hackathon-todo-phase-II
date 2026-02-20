
from dotenv import load_dotenv
load_dotenv()

import os
from urllib.parse import urlparse
from sqlmodel import SQLModel
from db import engine  # Use the configured engine from db.py
from models import User, Task, UserRole # Import ALL models to know what to drop/create

print("--- Force Migration Initializing ---")

# Step 1: Print database connection info for debugging
db_url = os.getenv("DATABASE_URL")
if db_url:
    try:
        parsed_url = urlparse(db_url)
        print(f"DEBUG: Connecting to Host: {parsed_url.hostname}")
        print(f"DEBUG: Connecting to Database: {parsed_url.path[1:]}")
    except Exception as e:
        print(f"DEBUG: Could not parse DATABASE_URL. Error: {e}")
else:
    print("DEBUG: DATABASE_URL environment variable not found!")

try:
    print("\nINFO: Attempting to drop all tables...")
    SQLModel.metadata.drop_all(engine)
    print("SUCCESS: All known tables dropped.")

    print("\nINFO: Attempting to create all tables...")
    SQLModel.metadata.create_all(engine)
    print("SUCCESS: All tables created.")

except Exception as e:
    print(f"\nERROR: An error occurred during migration: {e}")

print("\n--- Force Migration Complete ---")


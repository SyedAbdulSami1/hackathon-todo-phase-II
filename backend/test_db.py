import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print("DATABASE_URL:", DATABASE_URL)

# Try to parse the URL
try:
    from urllib.parse import urlparse
    parsed = urlparse(DATABASE_URL)
    print("Host:", parsed.hostname)
    print("Port:", parsed.port)
    print("Username:", parsed.username)
    print("Path:", parsed.path)

    # Try to create engine
    from sqlmodel import create_engine
    engine = create_engine(DATABASE_URL)
    print("Engine created successfully")

    # Test connection
    with engine.connect() as conn:
        from sqlalchemy import text
        result = conn.execute(text("SELECT 1"))
        print("Connection successful!")

except Exception as e:
    print("Error:", e)
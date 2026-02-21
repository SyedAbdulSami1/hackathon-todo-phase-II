from sqlmodel import Session, create_engine, select
from models import User
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

def check_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f"- Username: {u.username}, Email: {u.email}")

if __name__ == "__main__":
    check_users()

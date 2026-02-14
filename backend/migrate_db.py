
from sqlmodel import SQLModel
from db import engine

print("Initializing database...")
SQLModel.metadata.create_all(engine)
print("Database initialized.")


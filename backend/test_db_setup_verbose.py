#!/usr/bin/env python3

from sqlmodel import create_engine, SQLModel, Session, select
from models import User, Task

# Create in-memory SQLite database with echo
SQLModel.metadata.clear()
test_engine = create_engine("sqlite:///:memory:", echo=True)

print("Creating tables...")
# Create all tables
SQLModel.metadata.create_all(test_engine)
print("Tables created!")

# Test creating a user
with Session(test_engine) as session:
    print("\\nCreating user...")
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password",
        role="student"
    )
    session.add(user)
    print("Committing user...")
    session.commit()
    session.refresh(user)
    print(f"User created with ID: {user.id}")

    # Test creating a task
    print("\\nCreating task...")
    task = Task(
        title="Test Task",
        description="Test Description",
        status="pending",
        user_id=user.id
    )
    session.add(task)
    print("Committing task...")
    session.commit()
    session.refresh(task)
    print(f"Task created with ID: {task.id}")

    # Test querying
    print("\\nQuerying tasks...")
    tasks = session.exec(select(Task).where(Task.user_id == user.id)).all()
    print(f"Found {len(tasks)} tasks for user")

print("\\nAll tests passed!")
#!/usr/bin/env python3

from sqlmodel import create_engine, SQLModel, Session, select
from models import User, Task

# Create in-memory SQLite database
SQLModel.metadata.clear()
test_engine = create_engine("sqlite:///:memory:", echo=False)

# Create all tables
SQLModel.metadata.create_all(test_engine)

print("Tables created successfully!")

# Test creating a user
with Session(test_engine) as session:
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password",
        role="student"
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    print(f"User created with ID: {user.id}")

    # Test creating a task
    task = Task(
        title="Test Task",
        description="Test Description",
        status="pending",
        user_id=user.id
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    print(f"Task created with ID: {task.id}")

    # Test querying
    tasks = session.exec(select(Task).where(Task.user_id == user.id)).all()
    print(f"Found {len(tasks)} tasks for user")

print("All tests passed!")
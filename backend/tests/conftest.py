import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, SQLModel, Session
from main import app
from db import get_session

# Create in-memory SQLite database for testing
SQLModel.metadata.clear()
test_engine = create_engine("sqlite:///:memory:", echo=False)

def get_test_session():
    with Session(test_engine) as session:
        return session

# Override the session dependency
app.dependency_overrides[get_session] = get_test_session

@pytest.fixture(scope="function")
def client():
    # Create tables
    SQLModel.metadata.create_all(test_engine)

    with TestClient(app) as c:
        yield c

@pytest.fixture
def test_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }

@pytest.fixture
def test_task_data():
    return {
        "title": "Test Task",
        "description": "This is a test task"
    }
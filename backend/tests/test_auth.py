import pytest
from fastapi.testclient import TestClient
from main import app
from tests.conftest import get_test_session
from sqlmodel import Session
from models import User
from dependencies.auth import get_password_hash

app.dependency_overrides[get_test_session] = get_test_session

def test_register_user(client: TestClient, test_user_data):
    """Test user registration"""
    response = client.post("/api/auth/register", json=test_user_data)

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user_data["username"]
    assert data["email"] == test_user_data["email"]
    assert "hashed_password" not in data
    assert "id" in data

def test_register_duplicate_user(client: TestClient, test_user_data):
    """Test registering duplicate user"""
    # Register user first time
    client.post("/api/auth/register", json=test_user_data)

    # Try to register same user again
    response = client.post("/api/auth/register", json=test_user_data)

    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_user(client: TestClient, test_user_data):
    """Test user login with correct credentials"""
    # Register user first
    client.post("/api/auth/register", json=test_user_data)

    # Login
    login_data = {
        "username": test_user_data["username"],
        "password": test_user_data["password"]
    }
    response = client.post("/api/auth/login", data=login_data)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient, test_user_data):
    """Test login with wrong password"""
    # Register user first
    client.post("/api/auth/register", json=test_user_data)

    # Try login with wrong password
    login_data = {
        "username": test_user_data["username"],
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", data=login_data)

    assert response.status_code == 401

def test_login_nonexistent_user(client: TestClient):
    """Test login with non-existent user"""
    login_data = {
        "username": "nonexistent",
        "password": "password123"
    }
    response = client.post("/api/auth/login", data=login_data)

    assert response.status_code == 401

def test_get_current_user(client: TestClient, test_user_data):
    """Test getting current user profile"""
    # Register and login user
    client.post("/api/auth/register", json=test_user_data)
    login_data = {
        "username": test_user_data["username"],
        "password": test_user_data["password"]
    }
    login_response = client.post("/api/auth/login", data=login_data)
    token = login_response.json()["access_token"]

    # Get current user
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user_data["username"]
    assert data["email"] == test_user_data["email"]
import pytest
from fastapi.testclient import TestClient
from main import app
from tests.conftest import get_test_session
from tests.conftest import test_user_data, test_task_data

app.dependency_overrides[get_test_session] = get_test_session

def get_auth_token(client: TestClient, username: str, password: str):
    """Helper function to get auth token"""
    login_data = {"username": username, "password": password}
    response = client.post("/api/auth/login", data=login_data)
    return response.json()["access_token"]

def test_create_task(client: TestClient, test_user_data, test_task_data):
    """Test creating a new task"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Create task
    response = client.post(
        "/api/tasks/",
        json=test_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == test_task_data["title"]
    assert data["description"] == test_task_data["description"]
    assert data["status"] == "pending"
    assert data["user_id"] == 1

def test_create_task_without_auth(client: TestClient, test_task_data):
    """Test creating task without authentication"""
    response = client.post("/api/tasks/", json=test_task_data)
    assert response.status_code == 401

def test_create_task_invalid_data(client: TestClient, test_user_data):
    """Test creating task with invalid data"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Test empty title
    response = client.post(
        "/api/tasks/",
        json={"title": "", "description": "Test"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422

    # Test title too long
    long_title = "a" * 201
    response = client.post(
        "/api/tasks/",
        json={"title": long_title, "description": "Test"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422

def test_get_tasks(client: TestClient, test_user_data, test_task_data):
    """Test getting user's tasks"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Create a task
    client.post("/api/tasks/", json=test_task_data, headers={"Authorization": f"Bearer {token}"})

    # Get tasks
    response = client.get("/api/tasks/", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == test_task_data["title"]

def test_get_tasks_empty(client: TestClient, test_user_data):
    """Test getting tasks when none exist"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Get tasks
    response = client.get("/api/tasks/", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0

def test_get_task_by_id(client: TestClient, test_user_data, test_task_data):
    """Test getting specific task by ID"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Create a task
    create_response = client.post(
        "/api/tasks/",
        json=test_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    # Get task by ID
    response = client.get(f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == test_task_data["title"]

def test_get_nonexistent_task(client: TestClient, test_user_data):
    """Test getting non-existent task"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Try to get non-existent task
    response = client.get("/api/tasks/999", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 404

def test_update_task(client: TestClient, test_user_data, test_task_data):
    """Test updating a task"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Create a task
    create_response = client.post(
        "/api/tasks/",
        json=test_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    # Update task
    update_data = {"title": "Updated Task", "description": "Updated description"}
    response = client.put(
        f"/api/tasks/{task_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated description"

def test_update_task_not_owned(client: TestClient, test_user_data, test_task_data):
    """Test updating task that doesn't belong to user"""
    # Register two users
    user2_data = {
        "username": "user2",
        "email": "user2@example.com",
        "password": "testpass123"
    }
    client.post("/api/auth/register", json=test_user_data)
    client.post("/api/auth/register", json=user2_data)

    # Login as user1 and create task
    token1 = get_auth_token(client, test_user_data["username"], test_user_data["password"])
    create_response = client.post(
        "/api/tasks/",
        json=test_task_data,
        headers={"Authorization": f"Bearer {token1}"}
    )
    task_id = create_response.json()["id"]

    # Try to update as user2
    token2 = get_auth_token(client, user2_data["username"], user2_data["password"])
    response = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Hacked"},
        headers={"Authorization": f"Bearer {token2}"}
    )

    assert response.status_code == 403

def test_delete_task(client: TestClient, test_user_data, test_task_data):
    """Test deleting a task"""
    # Register and login
    client.post("/api/auth/register", json=test_user_data)
    token = get_auth_token(client, test_user_data["username"], test_user_data["password"])

    # Create a task
    create_response = client.post(
        "/api/tasks/",
        json=test_task_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    # Delete task
    response = client.delete(f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert data["deleted_task_id"] == task_id

    # Verify task is deleted
    get_response = client.get(f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"})
    assert get_response.status_code == 404
import pytest
from fastapi.testclient import TestClient

def test_signup(client: TestClient):
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login(client: TestClient):
    # First signup
    client.post(
        "/api/v1/auth/signup",
        json={"email": "login@example.com", "password": "password123", "full_name": "Login User"},
    )
    
    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert "access_token" in client.cookies

def test_read_user_me(client: TestClient):
    # Signup and login
    client.post(
        "/api/v1/auth/signup",
        json={"email": "me@example.com", "password": "password123", "full_name": "Me User"},
    )
    client.post(
        "/api/v1/auth/login",
        json={"email": "me@example.com", "password": "password123"},
    )
    
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"

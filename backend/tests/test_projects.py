import pytest
from fastapi.testclient import TestClient

def test_create_project(client: TestClient):
    # Login
    client.post(
        "/api/v1/auth/signup",
        json={"email": "proj@example.com", "password": "password123", "full_name": "Proj User"},
    )
    client.post(
        "/api/v1/auth/login",
        json={"email": "proj@example.com", "password": "password123"},
    )
    
    response = client.post(
        "/api/v1/projects/",
        json={"name": "New Project", "description": "Test description"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Project"
    assert "id" in data

def test_read_projects(client: TestClient):
    # Login
    client.post(
        "/api/v1/auth/signup",
        json={"email": "list@example.com", "password": "password123", "full_name": "List User"},
    )
    client.post(
        "/api/v1/auth/login",
        json={"email": "list@example.com", "password": "password123"},
    )
    
    # Create project
    client.post("/api/v1/projects/", json={"name": "P1"})
    
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "P1"

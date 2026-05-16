import pytest
from fastapi.testclient import TestClient

def test_member_cannot_delete_project(client: TestClient):
    # Create Admin
    client.post("/api/v1/auth/signup", json={"email": "admin@test.com", "password": "pass", "full_name": "Admin"})
    client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "pass"})
    
    # Create Project
    p_resp = client.post("/api/v1/projects/", json={"name": "Admin Project"})
    project_id = p_resp.json()["id"]
    client.post("/api/v1/auth/logout")
    
    # Create Member
    client.post("/api/v1/auth/signup", json={"email": "member@test.com", "password": "pass", "full_name": "Member"})
    client.post("/api/v1/auth/login", json={"email": "member@test.com", "password": "pass"})
    
    # Try to delete project (should fail as not a member yet)
    del_resp = client.delete(f"/api/v1/projects/{project_id}")
    assert del_resp.status_code == 403
    
    # Add member to project as ADMIN
    client.post("/api/v1/auth/logout")
    client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "pass"})
    client.post(f"/api/v1/projects/{project_id}/members", json={"email": "member@test.com", "role": "MEMBER"})
    client.post("/api/v1/auth/logout")
    
    # Try to delete again as Member
    client.post("/api/v1/auth/login", json={"email": "member@test.com", "password": "pass"})
    del_resp = client.delete(f"/api/v1/projects/{project_id}")
    assert del_resp.status_code == 403
    assert del_resp.json()["detail"] == "Admin privileges required"

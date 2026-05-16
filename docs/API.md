# API Documentation

The backend is built with FastAPI and follows RESTful principles. All endpoints are prefixed with `/api/v1`.

## Authentication
Authentication is handled via JWT tokens stored in **HTTP-only Cookies**.

- `POST /auth/signup`: Create a new user account.
- `POST /auth/login`: Authenticate and receive session cookies.
- `POST /auth/logout`: Clear session cookies.
- `GET /auth/me`: Get current authenticated user info.

## Projects
- `GET /projects/`: List all projects the user belongs to.
- `POST /projects/`: Create a new project (Creator becomes Admin).
- `GET /projects/{id}`: Get project details.
- `PATCH /projects/{id}`: Update project info (Admin only).
- `DELETE /projects/{id}`: Delete project (Admin only).

## Team Members
- `GET /projects/{id}/members`: List all project members.
- `POST /projects/{id}/members`: Invite a user to the project (Admin only).
- `PATCH /projects/{id}/members/{member_id}`: Update member role (Admin only).
- `DELETE /projects/{id}/members/{member_id}`: Remove member (Admin only).

## Tasks
- `GET /projects/{project_id}/tasks`: List all tasks in a project.
- `POST /projects/{project_id}/tasks`: Create a new task (Admin only).
- `GET /tasks/{id}`: Get task details.
- `PATCH /tasks/{id}`: Update task (Admin: full; Member: status only if assigned).
- `DELETE /tasks/{id}`: Delete task (Admin only).

## Dashboard
- `GET /dashboard/`: Aggregated statistics for the user across all projects.

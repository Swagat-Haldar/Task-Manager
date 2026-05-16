# Database Schema

The database is built with PostgreSQL using SQLAlchemy 2.0.

## Tables

### 1. `users`
Core user identity.
- `id`: UUID (Primary Key)
- `email`: String (Unique, Indexed)
- `hashed_password`: String
- `full_name`: String
- `is_active`: Boolean

### 2. `projects`
Project workspace details.
- `id`: UUID (Primary Key)
- `name`: String
- `description`: String
- `created_at`: DateTime
- `owner_id`: UUID (FK -> users)

### 3. `project_members`
Association table for RBAC.
- `id`: UUID (Primary Key)
- `user_id`: UUID (FK -> users)
- `project_id`: UUID (FK -> projects)
- `role`: Enum (ADMIN, MEMBER)

### 4. `tasks`
Task objectives within a project.
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String
- `status`: Enum (TODO, IN_PROGRESS, DONE)
- `priority`: Enum (LOW, MEDIUM, HIGH)
- `project_id`: UUID (FK -> projects)
- `assigned_to_id`: UUID (FK -> users, Optional)
- `created_by_id`: UUID (FK -> users)
- `due_date`: DateTime (Optional)

## Relationships
- **User <-> Project**: Many-to-Many via `project_members`.
- **Project <-> Task**: One-to-Many.
- **User <-> Task**: One-to-Many (as Assignee or Creator).

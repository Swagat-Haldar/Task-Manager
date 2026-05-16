# Role-Based Access Control (RBAC)

Our application uses a **Project-Level RBAC** model. This means your permissions are determined by your role within each specific project.

## Roles

### 1. Project Admin
The Admin has full control over the project workspace.
- **Project**: Edit description, delete project.
- **Members**: Invite new users, remove members, promote others to Admin.
- **Tasks**: Create tasks, assign to anyone, update any task, delete tasks.

### 2. Project Member
The Member is a contributor to the workspace.
- **Project**: View project details and dashboard.
- **Members**: View team list.
- **Tasks**: View all tasks. Can **only update the status** of tasks that are specifically assigned to them.

## Enforcement

### Backend
Enforced via FastAPI dependency injection:
- `deps.get_project_membership`: Verifies the user is part of the project.
- `deps.require_admin`: Verifies the user has the `ADMIN` role in the project.

### Frontend
- **UI Protection**: Buttons like "New Task" or "Add Member" are conditionally rendered based on the `myRole` state.
- **Interaction Protection**: Task status dropdowns are disabled for non-admins unless they are the assignee.

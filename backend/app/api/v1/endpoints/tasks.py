from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.task import Task as TaskModel, TaskStatus
from app.models.project_member import ProjectMember, ProjectRole
from app.schemas.task import Task, TaskCreate, TaskUpdate

router = APIRouter()

@router.get("/projects/{project_id}/tasks", response_model=List[Task])
def read_project_tasks(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    membership: ProjectMember = Depends(deps.get_project_membership),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    tasks = db.query(TaskModel).filter(
        TaskModel.project_id == project_id
    ).offset(skip).limit(limit).all()
    return tasks

@router.post("/projects/{project_id}/tasks", response_model=Task)
def create_task(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    task_in: TaskCreate,
    admin_membership: ProjectMember = Depends(deps.require_admin),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # If assigned_to_id is provided, verify they are a member of the project
    if task_in.assigned_to_id:
        member = db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == task_in.assigned_to_id
        ).first()
        if not member:
            raise HTTPException(status_code=400, detail="Assigned user is not a member of this project")

    task = TaskModel(
        **task_in.dict(),
        project_id=project_id,
        created_by_id=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/tasks/{task_id}", response_model=Task)
def read_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check project membership
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    return task

@router.patch("/tasks/{task_id}", response_model=Task)
def update_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: str,
    task_in: TaskUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check project membership
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    # RBAC Rules:
    # 1. Admin can update anything.
    # 2. Member can only update status if assigned to them.
    
    is_admin = membership.role == ProjectRole.ADMIN
    is_assigned = task.assigned_to_id == current_user.id
    
    update_data = task_in.dict(exclude_unset=True)
    
    if not is_admin:
        # Member trying to update
        if not is_assigned:
            raise HTTPException(status_code=403, detail="You can only update tasks assigned to you")
        
        # Only status allowed for non-admins
        allowed_fields = {"status"}
        if any(field not in allowed_fields for field in update_data):
            raise HTTPException(status_code=403, detail="Members can only update task status")

    # If assigned_to_id is being updated, verify membership
    if "assigned_to_id" in update_data and update_data["assigned_to_id"]:
         member = db.query(ProjectMember).filter(
            ProjectMember.project_id == task.project_id,
            ProjectMember.user_id == update_data["assigned_to_id"]
        ).first()
         if not member:
            raise HTTPException(status_code=400, detail="Assigned user is not a member of this project")

    for field in update_data:
        setattr(task, field, update_data[field])
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_task(
    *,
    db: Session = Depends(deps.get_db),
    task_id: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Only Admin can delete
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        ProjectMember.user_id == current_user.id,
        ProjectMember.role == ProjectRole.ADMIN
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Admin privileges required to delete tasks")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.task import TaskStatus, TaskPriority
from app.schemas.user import User

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    assigned_to_id: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    assigned_to_id: Optional[str] = None

class Task(TaskBase):
    id: str
    project_id: str
    created_by_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    assigned_user: Optional[User] = None

    class Config:
        from_attributes = True

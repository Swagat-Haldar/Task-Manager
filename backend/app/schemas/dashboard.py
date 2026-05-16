from typing import List, Optional
from pydantic import BaseModel
from app.schemas.task import Task

class DashboardStats(BaseModel):
    total_projects: int
    total_tasks: int
    todo_tasks: int
    in_progress_tasks: int
    done_tasks: int
    overdue_tasks: int
    assigned_to_me: int
    recent_tasks: List[Task]

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.task import Task, TaskStatus
from app.schemas.dashboard import DashboardStats

router = APIRouter()

@router.get("/", response_model=DashboardStats)
def get_dashboard_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    # Projects where user is a member
    project_ids = [m.project_id for m in current_user.memberships]
    
    total_projects = len(project_ids)
    
    # Task stats for those projects
    tasks_query = db.query(Task).filter(Task.project_id.in_(project_ids))
    
    total_tasks = tasks_query.count()
    todo_tasks = tasks_query.filter(Task.status == TaskStatus.TODO).count()
    in_progress_tasks = tasks_query.filter(Task.status == TaskStatus.IN_PROGRESS).count()
    done_tasks = tasks_query.filter(Task.status == TaskStatus.DONE).count()
    
    overdue_tasks = tasks_query.filter(
        Task.status != TaskStatus.DONE,
        Task.due_date < datetime.utcnow()
    ).count()
    
    assigned_to_me = tasks_query.filter(Task.assigned_to_id == current_user.id).count()
    
    recent_tasks = tasks_query.order_by(Task.created_at.desc()).limit(5).all()
    
    return {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "todo_tasks": todo_tasks,
        "in_progress_tasks": in_progress_tasks,
        "done_tasks": done_tasks,
        "overdue_tasks": overdue_tasks,
        "assigned_to_me": assigned_to_me,
        "recent_tasks": recent_tasks
    }

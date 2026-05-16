from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.project import Project as ProjectModel
from app.models.project_member import ProjectMember, ProjectRole
from app.schemas.project import Project, ProjectCreate, ProjectUpdate

router = APIRouter()

@router.get("/", response_model=List[Project])
def read_projects(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    # Get projects where user is a member
    projects = (
        db.query(ProjectModel)
        .join(ProjectMember)
        .filter(ProjectMember.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return projects

@router.post("/", response_model=Project)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    project = ProjectModel(
        name=project_in.name,
        description=project_in.description,
        created_by_id=current_user.id,
    )
    db.add(project)
    db.flush()  # To get project ID
    
    # Add creator as ADMIN
    member = ProjectMember(
        project_id=project.id,
        user_id=current_user.id,
        role=ProjectRole.ADMIN
    )
    db.add(member)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=Project)
def read_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    membership: ProjectMember = Depends(deps.get_project_membership),
) -> Any:
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    return project

@router.patch("/{project_id}", response_model=Project)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    project_in: ProjectUpdate,
    membership: ProjectMember = Depends(deps.require_admin),
) -> Any:
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    update_data = project_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(project, field, update_data[field])
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    membership: ProjectMember = Depends(deps.require_admin),
) -> Any:
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

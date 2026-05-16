from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User as UserModel
from app.models.project_member import ProjectMember as ProjectMemberModel, ProjectRole
from app.schemas.member import ProjectMember, MemberAdd, MemberUpdate

router = APIRouter()

@router.get("/{project_id}/members", response_model=List[ProjectMember])
def read_project_members(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    membership: ProjectMemberModel = Depends(deps.get_project_membership),
) -> Any:
    members = db.query(ProjectMemberModel).filter(
        ProjectMemberModel.project_id == project_id
    ).all()
    return members

@router.post("/{project_id}/members", response_model=ProjectMember)
def add_project_member(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    member_in: MemberAdd,
    admin_membership: ProjectMemberModel = Depends(deps.require_admin),
) -> Any:
    user = db.query(UserModel).filter(UserModel.email == member_in.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already a member
    existing = db.query(ProjectMemberModel).filter(
        ProjectMemberModel.project_id == project_id,
        ProjectMemberModel.user_id == user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member of this project")
    
    member = ProjectMemberModel(
        project_id=project_id,
        user_id=user.id,
        role=member_in.role
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.patch("/{project_id}/members/{member_id}", response_model=ProjectMember)
def update_project_member(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    member_id: str,
    member_in: MemberUpdate,
    admin_membership: ProjectMemberModel = Depends(deps.require_admin),
) -> Any:
    member = db.query(ProjectMemberModel).filter(
        ProjectMemberModel.id == member_id,
        ProjectMemberModel.project_id == project_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member.role = member_in.role
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{project_id}/members/{member_id}")
def remove_project_member(
    *,
    db: Session = Depends(deps.get_db),
    project_id: str,
    member_id: str,
    admin_membership: ProjectMemberModel = Depends(deps.require_admin),
) -> Any:
    member = db.query(ProjectMemberModel).filter(
        ProjectMemberModel.id == member_id,
        ProjectMemberModel.project_id == project_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Cannot remove the last admin
    if member.role == ProjectRole.ADMIN:
        admin_count = db.query(ProjectMemberModel).filter(
            ProjectMemberModel.project_id == project_id,
            ProjectMemberModel.role == ProjectRole.ADMIN
        ).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin from the project")

    db.delete(member)
    db.commit()
    return {"message": "Member removed successfully"}

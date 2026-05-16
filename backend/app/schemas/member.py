from pydantic import BaseModel, EmailStr
from app.models.project_member import ProjectRole
from app.schemas.user import User

class MemberBase(BaseModel):
    role: ProjectRole = ProjectRole.MEMBER

class MemberAdd(MemberBase):
    email: EmailStr

class MemberUpdate(BaseModel):
    role: ProjectRole

class ProjectMember(MemberBase):
    id: str
    project_id: str
    user_id: str
    user: User

    class Config:
        from_attributes = True

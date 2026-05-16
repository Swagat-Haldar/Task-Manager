from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None

class Project(ProjectBase):
    id: str
    created_by_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

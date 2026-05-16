from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base_class import Base

class ProjectRole(str, enum.Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"

class ProjectMember(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("project.id"), nullable=False)
    user_id = Column(String, ForeignKey("user.id"), nullable=False)
    role = Column(Enum(ProjectRole), default=ProjectRole.MEMBER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="memberships")

    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_project_member"),
    )

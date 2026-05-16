from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base_class import Base

class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class Task(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True, nullable=False)
    description = Column(String)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    due_date = Column(DateTime(timezone=True))
    
    project_id = Column(String, ForeignKey("project.id"), nullable=False)
    assigned_to_id = Column(String, ForeignKey("user.id"), nullable=True)
    created_by_id = Column(String, ForeignKey("user.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assigned_user = relationship("User", foreign_keys=[assigned_to_id], back_populates="assigned_tasks")
    creator = relationship("User", foreign_keys=[created_by_id], back_populates="created_tasks")

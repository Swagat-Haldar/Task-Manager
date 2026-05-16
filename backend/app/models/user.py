from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.base_class import Base

class User(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    created_projects = relationship("Project", back_populates="creator", cascade="all, delete-orphan")
    memberships = relationship("ProjectMember", back_populates="user", cascade="all, delete-orphan")
    assigned_tasks = relationship("Task", foreign_keys="Task.assigned_to_id", back_populates="assigned_user")
    created_tasks = relationship("Task", foreign_keys="Task.created_by_id", back_populates="creator")

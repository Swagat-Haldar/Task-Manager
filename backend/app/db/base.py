# Import all models here so that Alembic can discover them
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.project import Project  # noqa
from app.models.project_member import ProjectMember, ProjectRole  # noqa
from app.models.task import Task, TaskStatus, TaskPriority  # noqa

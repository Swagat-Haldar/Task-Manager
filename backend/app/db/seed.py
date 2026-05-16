from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.models.user import User
from app.models.project import Project
from app.models.project_member import ProjectMember, ProjectRole
from app.models.task import Task, TaskStatus, TaskPriority
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # 1. Create Users
        admin_email = "admin@example.com"
        member_email = "member@example.com"
        
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                full_name="Admin User",
                hashed_password=get_password_hash("password123")
            )
            db.add(admin)
        
        member = db.query(User).filter(User.email == member_email).first()
        if not member:
            member = User(
                email=member_email,
                full_name="Member User",
                hashed_password=get_password_hash("password123")
            )
            db.add(member)
        
        db.commit()
        db.refresh(admin)
        db.refresh(member)
        
        # 2. Create Project
        project_name = "Website Redesign"
        project = db.query(Project).filter(Project.name == project_name).first()
        if not project:
            project = Project(
                name=project_name,
                description="Modernizing the corporate website with a new design system.",
                created_by_id=admin.id
            )
            db.add(project)
            db.flush()
            
            # 3. Add Members
            db.add(ProjectMember(project_id=project.id, user_id=admin.id, role=ProjectRole.ADMIN))
            db.add(ProjectMember(project_id=project.id, user_id=member.id, role=ProjectRole.MEMBER))
            
            # 4. Create Tasks
            tasks = [
                Task(
                    title="Design Logo",
                    description="Create a new responsive logo.",
                    status=TaskStatus.DONE,
                    priority=TaskPriority.HIGH,
                    project_id=project.id,
                    created_by_id=admin.id,
                    assigned_to_id=admin.id
                ),
                Task(
                    title="Setup Homepage",
                    description="Implement the hero section of the homepage.",
                    status=TaskStatus.IN_PROGRESS,
                    priority=TaskPriority.MEDIUM,
                    project_id=project.id,
                    created_by_id=admin.id,
                    assigned_to_id=member.id
                ),
                Task(
                    title="Draft Content",
                    description="Write the copy for the About Us page.",
                    status=TaskStatus.TODO,
                    priority=TaskPriority.LOW,
                    project_id=project.id,
                    created_by_id=admin.id,
                    assigned_to_id=member.id
                ),
                Task(
                    title="API Integration",
                    description="Connect the contact form to the backend.",
                    status=TaskStatus.TODO,
                    priority=TaskPriority.HIGH,
                    project_id=project.id,
                    created_by_id=admin.id,
                    assigned_to_id=admin.id,
                    due_date=datetime.utcnow() - timedelta(days=2) # Overdue
                ),
                Task(
                    title="Testing & QA",
                    description="Perform cross-browser testing.",
                    status=TaskStatus.TODO,
                    priority=TaskPriority.MEDIUM,
                    project_id=project.id,
                    created_by_id=admin.id
                )
            ]
            db.add_all(tasks)
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

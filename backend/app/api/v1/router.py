from fastapi import APIRouter
from app.api.v1.endpoints import auth, projects, members, tasks, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(members.router, prefix="/projects", tags=["members"])
api_router.include_router(tasks.router, prefix="", tags=["tasks"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

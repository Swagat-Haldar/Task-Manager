from pydantic_settings import BaseSettings
from typing import List, Union, Any
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Team Task Manager"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS - Use Union to prevent Pydantic from forcing JSON parsing on env vars
    BACKEND_CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        return v
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/team_task_manager"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

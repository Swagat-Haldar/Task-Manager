from typing import Any, List
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate
from app.schemas.auth import Login

router = APIRouter()

@router.post("/signup", response_model=User)
def signup(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate
) -> Any:
    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = UserModel(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login(
    response: Response,
    *,
    db: Session = Depends(deps.get_db),
    login_data: Login
) -> Any:
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
    if not user or not security.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    is_prod = settings.ENVIRONMENT == "production"
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="none" if is_prod else "lax",
        secure=is_prod,
    )
    return {"message": "Successfully logged in"}

@router.post("/logout")
def logout(response: Response):
    is_prod = settings.ENVIRONMENT == "production"
    response.delete_cookie(
        "access_token",
        samesite="none" if is_prod else "lax",
        secure=is_prod
    )
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=User)
def read_user_me(
    current_user: UserModel = Depends(deps.get_current_user),
) -> Any:
    return current_user

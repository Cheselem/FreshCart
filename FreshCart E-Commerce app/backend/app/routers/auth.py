"""POST /auth/register and /auth/login — TRD §3."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import User
from app.schemas import LoginResponse, RegisterRequest, RegisterResponse
from app.security import hash_password, make_access_token, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    body: RegisterRequest,
    db:   Annotated[Session, Depends(get_session)],
):
    user = User(email=str(body.email), password_hash=hash_password(body.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already registered")
    db.refresh(user)
    return RegisterResponse(id=user.id, email=user.email)


@router.post("/login", response_model=LoginResponse)
def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    db:   Annotated[Session, Depends(get_session)],
):
    user = db.scalar(select(User).where(User.email == form.username))
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = make_access_token(subject=user.email)
    return LoginResponse(access_token=token)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import create_access_token, verify_password


router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)


@router.post("/login", response_model=TokenResponse)
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db),
):
    usuario = (
        db.query(User)
        .filter(User.email == dados.email)
        .first()
    )

    if usuario is None:
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha inválidos",
        )

    if not verify_password(dados.password, usuario.password_hash):
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha inválidos",
        )

    access_token = create_access_token(
        data={
            "sub": str(usuario.id),
        }
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
    )
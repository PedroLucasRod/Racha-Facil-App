from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserRoleUpdate,
    UserResponse,
)
from app.core.security import hash_password
from app.core.dependencies import get_current_user, get_current_admin


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/admin/teste")
def teste_admin(
    usuario_atual: User = Depends(get_current_admin),
):
    return {
        "message": "Você é administrador!",
        "usuario": usuario_atual.name,
    }


@router.get("/", response_model=list[UserResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
):
    usuarios = db.query(User).all()

    return usuarios


@router.get("/me", response_model=UserResponse)
def buscar_usuario_atual(
    usuario_atual: User = Depends(get_current_user),
):
    return usuario_atual


@router.patch("/me", response_model=UserResponse)
def atualizar_usuario_atual(
    dados: UserUpdate,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
):
    usuario_existente = (
        db.query(User)
        .filter(
            User.email == dados.email,
            User.id != usuario_atual.id,
        )
        .first()
    )

    if usuario_existente is not None:
        raise HTTPException(
            status_code=400,
            detail="E-mail já cadastrado",
        )

    usuario_atual.name = dados.name
    usuario_atual.email = dados.email
    usuario_atual.preferred_role = dados.preferred_role

    db.commit()
    db.refresh(usuario_atual)

    return usuario_atual

@router.patch("/me/role", response_model=UserResponse)
def atualizar_preferencia_de_posicao(
    dados: UserRoleUpdate,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
):
    if dados.preferred_role not in {"Jogador", "Goleiro"}:
        raise HTTPException(
            status_code=400,
            detail="Posição inválida. Escolha Jogador ou Goleiro.",
        )

    usuario_atual.preferred_role = dados.preferred_role

    db.commit()
    db.refresh(usuario_atual)

    return usuario_atual


@router.get("/{user_id}", response_model=UserResponse)
def buscar_usuario(
    user_id: int,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
):
    usuario = db.query(User).filter(User.id == user_id).first()

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado",
        )

    return usuario


@router.post("/", response_model=UserResponse, status_code=201)
def criar_usuario(
    dados: UserCreate,
    db: Session = Depends(get_db),
):
    usuario_existente = (
        db.query(User)
        .filter(User.email == dados.email)
        .first()
    )

    if usuario_existente is not None:
        raise HTTPException(
            status_code=400,
            detail="E-mail já cadastrado",
        )

    novo_usuario = User(
        name=dados.name,
        email=dados.email,
        password_hash=hash_password(dados.password),
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario
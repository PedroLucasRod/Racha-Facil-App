from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.dependencies import get_db
from app.models.user import User


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Token inválido",
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado",
        )

    usuario = db.query(User).filter(User.id == int(user_id)).first()

    if usuario is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário não encontrado",
        )

    return usuario

def get_current_admin(
    usuario_atual: User = Depends(get_current_user),
) -> User:

    if not usuario_atual.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso permitido apenas para administradores",
        )

    return usuario_atual
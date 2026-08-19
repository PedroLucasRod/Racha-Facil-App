from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.racha import Racha
from app.schemas.racha import RachaCreate, RachaUpdate, RachaResponse
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter(
    prefix="/rachas",
    tags=["Rachas"],
)


@router.get("/", response_model=list[RachaResponse])
def listar_rachas(
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
):
    rachas = db.query(Racha).all()

    return rachas


@router.get("/{racha_id}", response_model=RachaResponse)
def buscar_racha(
    racha_id: int,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
):
    racha = db.query(Racha).filter(Racha.id == racha_id).first()

    if racha is None: 
        raise HTTPException( 
            status_code=404, 
            detail="Racha não encontrado", 
            ) 
    
    return racha

@router.patch("/{racha_id}/finalizar", response_model=RachaResponse)
def finalizar_racha(
    racha_id: int,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_admin),
):
    racha = (
        db.query(Racha)
        .filter(Racha.id == racha_id)
        .first()
    )

    if racha is None:
        raise HTTPException(
            status_code=404,
            detail="Racha não encontrado",
        )

    if racha.status == "Finalizado":
        raise HTTPException(
            status_code=400,
            detail="Este racha já está finalizado",
        )

    racha.status = "Finalizado"

    db.commit()
    db.refresh(racha)

    return racha

@router.post("/", response_model=RachaResponse, status_code=201)
def criar_racha(
    dados: RachaCreate,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_admin),
):
    novo_racha = Racha(
        date=dados.date,
        location=dados.location,
        status=dados.status,
        max_players=dados.max_players,
        max_goalkeepers=dados.max_goalkeepers,
)

    db.add(novo_racha)
    db.commit()
    db.refresh(novo_racha)

    return novo_racha

@router.delete("/{racha_id}", status_code=204)
def deletar_racha(
    racha_id: int,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_admin),
):
    racha = db.query(Racha).filter(Racha.id == racha_id).first()

    if racha is None:
        raise HTTPException(
            status_code=404,
            detail="Racha não encontrado",
        )

    db.delete(racha)
    db.commit()

    return None

@router.put("/{racha_id}", response_model=RachaResponse)
def atualizar_racha(
    racha_id: int,
    dados: RachaUpdate,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_admin),
):
    racha = db.query(Racha).filter(Racha.id == racha_id).first()

    if racha is None:
        raise HTTPException(
            status_code=404,
            detail="Racha não encontrado",
        )

    racha.date = dados.date
    racha.location = dados.location
    racha.max_players = dados.max_players
    racha.max_goalkeepers = dados.max_goalkeepers

    db.commit()
    db.refresh(racha)

    return racha


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_current_admin
from app.database.dependencies import get_db
from app.models.racha import Racha
from app.models.racha_participant import RachaParticipant
from app.models.user import User
from app.schemas.racha_participant import (
    RachaParticipantCreate,
    RachaParticipantPaymentUpdate,
    RachaParticipantResponse,
)

router = APIRouter(
    prefix="/rachas",
    tags=["Racha Participantes"],
)

def montar_resposta_participante(participante: RachaParticipant):
    return {
        "id": participante.id,
        "racha_id": participante.racha_id,
        "user_id": participante.user_id,
        "user_name": participante.user.name,
        "user_email": participante.user.email,
        "role": participante.role,
        "payment_status": participante.payment_status,
        "participation_status": participante.participation_status,
        "confirmed_at": participante.confirmed_at,
        "queue_position": getattr(participante, "queue_position", None),
    }

@router.post(
    "/{racha_id}/participantes",
    response_model=RachaParticipantResponse,
    status_code=201,
)
def entrar_no_racha(
    racha_id: int,
    dados: RachaParticipantCreate,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
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
            detail="Este racha já foi finalizado",
        )

    # =========================
    # PAPEL INVÁLIDO
    # =========================

    if dados.role not in ["Jogador", "Goleiro"]:
        raise HTTPException(
            status_code=400,
            detail="Função inválida. Escolha Jogador ou Goleiro.",
        )

    # =========================
    # VERIFICA PARTICIPAÇÃO EXISTENTE
    # =========================

    participacao_existente = (
        db.query(RachaParticipant)
        .filter(
            RachaParticipant.racha_id == racha_id,
            RachaParticipant.user_id == usuario_atual.id,
        )
        .first()
    )

    if participacao_existente is not None:
        raise HTTPException(
            status_code=400,
            detail="Você já está participando deste racha",
        )

    # =========================
    # VERIFICA VAGA
    # =========================

    if dados.role == "Jogador":

        quantidade_jogadores = (
            db.query(RachaParticipant)
            .filter(
                RachaParticipant.racha_id == racha_id,
                RachaParticipant.role == "Jogador",
                RachaParticipant.participation_status == "Confirmado",
            )
            .count()
        )

        vaga_disponivel = quantidade_jogadores < racha.max_players

    else:

        quantidade_goleiros = (
            db.query(RachaParticipant)
            .filter(
                RachaParticipant.racha_id == racha_id,
                RachaParticipant.role == "Goleiro",
                RachaParticipant.participation_status == "Confirmado",
            )
            .count()
        )

        vaga_disponivel = quantidade_goleiros < racha.max_goalkeepers

    # =========================
    # DEFINE STATUS
    # =========================

    if vaga_disponivel:
        participation_status = "Confirmado"
    else:
        participation_status = "Lista de Espera"

    # =========================
    # CRIA PARTICIPAÇÃO
    # =========================

    nova_participacao = RachaParticipant(
        racha_id=racha_id,
        user_id=usuario_atual.id,
        role=dados.role,
        participation_status=participation_status,
    )

    db.add(nova_participacao)
    db.commit()
    db.refresh(nova_participacao)

    return montar_resposta_participante(nova_participacao)

@router.delete(
    "/{racha_id}/participantes",
    status_code=204,
)
def sair_do_racha(
    racha_id: int,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
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

    # =========================
    # BUSCA A PARTICIPAÇÃO
    # =========================

    participacao = (
        db.query(RachaParticipant)
        .filter(
            RachaParticipant.racha_id == racha_id,
            RachaParticipant.user_id == usuario_atual.id,
        )
        .first()
    )

    if participacao is None:
        raise HTTPException(
            status_code=400,
            detail="Você não está participando deste racha",
        )

    # Guarda o papel antes de excluir
    role = participacao.role

    # =========================
    # REMOVE O PARTICIPANTE
    # =========================

    db.delete(participacao)
    db.commit()

    # =========================
    # PROCURA PRIMEIRO DA
    # LISTA DE ESPERA
    # =========================

    proximo_participante = (
        db.query(RachaParticipant)
        .filter(
            RachaParticipant.racha_id == racha_id,
            RachaParticipant.role == role,
            RachaParticipant.participation_status == "Lista de Espera",
        )
        .order_by(RachaParticipant.confirmed_at.asc())
        .first()
    )

    # =========================
    # PROMOVE PARA CONFIRMADO
    # =========================

    if proximo_participante is not None:

        proximo_participante.participation_status = "Confirmado"

        db.commit()

    return None

@router.get(
    "/{racha_id}/participantes",
    response_model=list[RachaParticipantResponse],
)
def listar_participantes(
    racha_id: int,
    db: Session = Depends(get_db),
    usuario_atual: User = Depends(get_current_user),
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

    participantes = (
        db.query(RachaParticipant)
        .filter(RachaParticipant.racha_id == racha_id)
        .all()
    )

    # =========================
    # CALCULA POSIÇÃO NA FILA
    # =========================

    fila_jogadores = [
        participante
        for participante in participantes
        if participante.role == "Jogador"
        and participante.participation_status == "Lista de Espera"
    ]

    fila_goleiros = [
        participante
        for participante in participantes
        if participante.role == "Goleiro"
        and participante.participation_status == "Lista de Espera"
    ]

    # Ordena pela data de entrada
    fila_jogadores.sort(key=lambda x: x.confirmed_at)
    fila_goleiros.sort(key=lambda x: x.confirmed_at)

    # Define posição dos jogadores
    for posicao, participante in enumerate(fila_jogadores, start=1):
        participante.queue_position = posicao

    # Define posição dos goleiros
    for posicao, participante in enumerate(fila_goleiros, start=1):
        participante.queue_position = posicao

    # Participantes confirmados não possuem posição na fila
    for participante in participantes:
        if participante.participation_status == "Confirmado":
            participante.queue_position = None

    # =========================
    # MONTA A RESPOSTA
    # =========================

    resposta = []

    for participante in participantes:
        resposta.append({
            "id": participante.id,
            "racha_id": participante.racha_id,
            "user_id": participante.user_id,
            "user_name": participante.user.name,
            "user_email": participante.user.email,
            "role": participante.role,
            "payment_status": participante.payment_status,
            "participation_status": participante.participation_status,
            "confirmed_at": participante.confirmed_at,
            "queue_position": getattr(participante, "queue_position", None),
        })

    return resposta

@router.patch(
    "/{racha_id}/participantes/{participante_id}/pagamento",
    response_model=RachaParticipantResponse,
)
def atualizar_pagamento(
    racha_id: int,
    participante_id: int,
    dados: RachaParticipantPaymentUpdate,
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

    participacao = (
        db.query(RachaParticipant)
        .filter(
            RachaParticipant.id == participante_id,
            RachaParticipant.racha_id == racha_id,
        )
        .first()
    )

    if participacao is None:
        raise HTTPException(
            status_code=404,
            detail="Participante não encontrado neste racha",
        )

    if dados.payment_status not in ["Pendente", "Pago"]:
        raise HTTPException(
            status_code=400,
            detail="Status de pagamento inválido. Use Pendente ou Pago.",
        )

    participacao.payment_status = dados.payment_status

    db.commit()
    db.refresh(participacao)

    return montar_resposta_participante(participacao)
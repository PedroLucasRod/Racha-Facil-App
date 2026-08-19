from app.database.database import SessionLocal
from app.models.user import User
from app.models.racha import Racha
from app.models.racha_participant import RachaParticipant
from datetime import datetime

def seed():
    db = SessionLocal()

    try:
        user = User(
            name="Pedro Lucas",
            email="pedro@example.com",
            password_hash="teste",
        )

        racha = Racha(
            date=datetime(2026, 10, 12, 16, 0),
            location="Campo Central",
            status="Aberto",
            max_players=20,
            max_goalkeepers=4,
        )

        db.add(user)
        db.add(racha)
        db.commit()

        db.refresh(user)
        db.refresh(racha)

        participant = RachaParticipant(
            racha_id=racha.id,
            user_id=user.id,
            role="Jogador",
        )

        db.add(participant)
        db.commit()

        print(f"Usuário criado: {user.id} - {user.name}")
        print(f"Racha criado: {racha.id} - {racha.location}")
        print(f"Participação criada: {participant.id} - {participant.role}")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
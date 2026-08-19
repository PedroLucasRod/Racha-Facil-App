from app.database.database import SessionLocal
from app.models.user import User
from app.models.racha import Racha
from app.models.racha_participant import RachaParticipant


def test_database():
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == "pedro@example.com").first()

        if not user:
            print("Usuário não encontrado.")
            return

        print(f"Usuário: {user.name}")
        print(f"Email: {user.email}")

        for participation in user.racha_participations:
            print(
                f"Racha: {participation.racha.location} | "
                f"Função: {participation.role}"
            )

    finally:
        db.close()


if __name__ == "__main__":
    test_database()
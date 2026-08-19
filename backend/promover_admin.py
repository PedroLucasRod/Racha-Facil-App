from app.database.database import SessionLocal
from app.models.user import User
from app.models.racha import Racha
from app.models.racha_participant import RachaParticipant


db = SessionLocal()

try:
    usuario = (
        db.query(User)
        .filter(User.email == "joao@email.com")
        .first()
    )

    if usuario is None:
        print("Usuário não encontrado.")
    else:
        usuario.is_admin = True
        db.commit()

        print(f"{usuario.name} agora é administrador.")

finally:
    db.close()
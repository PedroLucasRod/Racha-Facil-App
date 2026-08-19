from app.database.database import Base, engine

from app.models.racha import Racha
from app.models.racha_participant import RachaParticipant
from app.models.user import User


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Banco de dados criado com sucesso!")
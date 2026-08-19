from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa todos os modelos para que o SQLAlchemy conheça
# todas as classes e seus relacionamentos.
from app.models.user import User
from app.models.racha import Racha
from app.models.racha_participant import RachaParticipant

from app.routes.racha import router as racha_router
from app.routes.user import router as user_router
from app.routes.auth import router as auth_router
from app.routes.racha_participant import (
    router as racha_participant_router
)

app = FastAPI(
    title="Racha Fácil API",
    version="1.0.0",
    description="API para gerenciamento do Racha Fácil.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(racha_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(racha_participant_router)
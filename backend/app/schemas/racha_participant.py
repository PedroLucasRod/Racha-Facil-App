from datetime import datetime

from pydantic import BaseModel


class RachaParticipantCreate(BaseModel):
    role: str = "Jogador"

class RachaParticipantPaymentUpdate(BaseModel):
    payment_status: str

class RachaParticipantResponse(BaseModel):
    id: int
    racha_id: int

    user_id: int
    user_name: str
    user_email: str
    
    role: str
    payment_status: str
    participation_status: str
    confirmed_at: datetime
    queue_position: int | None = None

    class Config:
        from_attributes = True
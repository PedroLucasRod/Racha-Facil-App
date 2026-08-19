from datetime import datetime

from pydantic import BaseModel

class RachaCreate(BaseModel):
    date: datetime
    location: str
    status: str = "Aberto"
    max_players: int = 20
    max_goalkeepers: int = 4

class RachaUpdate(BaseModel):
    date: datetime
    location: str
    max_players: int
    max_goalkeepers: int

class RachaResponse(BaseModel):
    id: int
    date: datetime
    location: str
    status: str
    max_players: int
    max_goalkeepers: int
    created_at: datetime

    class Config:
        from_attributes = True
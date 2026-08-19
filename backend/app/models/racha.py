from datetime import datetime

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class Racha(Base):
    __tablename__ = "rachas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Aberto")
    max_players: Mapped[int] = mapped_column(Integer, nullable=False, default=20)
    max_goalkeepers: Mapped[int] = mapped_column(Integer, nullable=False, default=4)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    participants = relationship(
        "RachaParticipant",
        back_populates="racha",
        cascade="all, delete-orphan",
    )
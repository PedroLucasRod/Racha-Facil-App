from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class RachaParticipant(Base):
    __tablename__ = "racha_participants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    racha_id: Mapped[int] = mapped_column(
        ForeignKey("rachas.id"),
        nullable=False,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Jogador",
    )

    participation_status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Confirmado",
        server_default="Confirmado",
    )

    payment_status: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
    default="Pendente",
    )

    confirmed_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    racha = relationship(
        "Racha",
        back_populates="participants",
    )

    user = relationship(
        "User",
        back_populates="racha_participations",
    )

    __table_args__ = (
        UniqueConstraint(
            "racha_id",
            "user_id",
            name="uq_racha_participant",
        ),
    )
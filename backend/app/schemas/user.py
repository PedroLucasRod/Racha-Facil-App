from typing import Literal

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str
    email: EmailStr
    preferred_role: Literal["Jogador", "Goleiro"]


class UserRoleUpdate(BaseModel):
    preferred_role: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    is_admin: bool
    preferred_role: str

    class Config:
        from_attributes = True
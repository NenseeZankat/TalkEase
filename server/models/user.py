from pydantic import BaseModel, EmailStr
from typing import Optional

# User Schema for Registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# User Schema for Response
class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr

# User Schema for Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

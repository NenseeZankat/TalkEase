from fastapi import APIRouter, HTTPException, Depends
from db.database import db, users_collection
from models.user import UserCreate, UserResponse, UserLogin
from utils.hashing import hash_password, verify_password
from utils.jwt import create_access_token
from bson import ObjectId

router = APIRouter()

# Register User
@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }
    result = users_collection.insert_one(new_user)
    return UserResponse(id=str(result.inserted_id), username=user.username, email=user.email)

# Fetch All Users
@router.get("/users", response_model=list[UserResponse])
async def get_all_users():
    users = users_collection.find()
    return [
        UserResponse(id=str(user["_id"]), username=user["username"], email=user["email"])
        for user in users
    ]

# Get User by ID
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(id=str(user["_id"]), username=user["username"], email=user["email"])

# Login User
@router.post("/login")
async def login_user(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    token = create_access_token(data={"user_id": str(existing_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}

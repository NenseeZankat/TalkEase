from fastapi import FastAPI
from routes import auth

app = FastAPI()

app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Chatbot!"}

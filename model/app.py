import os
from fastapi import FastAPI
from pydantic import BaseModel
from llama_cpp import Llama

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

# 🔄 Load model ONCE at startup (same as test.py)
model_path = "./save_model/llama-2-7b-chat-compressed_Q4.gguf"  # Update path if needed
print(f"🔄 Loading model: {model_path}")

llm = Llama(model_path=model_path, n_ctx=2048, n_threads=8)  
print("✅ Model loaded successfully!\n")

# Maintain chat history for context
chat_history = []

@app.post("/chat/")
async def chat(request: ChatRequest):
    user_message = request.message.strip()

    response = "This is placeholder response" 
    return {"response": response}

@app.get("/")
async def root():
    return {"message": "LLaMA 2 Chatbot API is running!"}

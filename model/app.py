import torch
import os
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer

# Initialize FastAPI app
app = FastAPI()

# Load model and tokenizer
def load_model():
    print("\U0001F7E2 Loading model...")
    model_path = "./saved_model"
    if not os.path.exists(model_path):
        raise FileNotFoundError("Model folder not found. Run `model.py` first to save the model locally.")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    if device == "cuda":
        torch.cuda.empty_cache()

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(
        model_path, torch_dtype=torch.float16 if device == "cuda" else torch.float32, 
        low_cpu_mem_usage=True, device_map="auto"
    )

    tokenizer.pad_token = tokenizer.eos_token if tokenizer.pad_token is None else tokenizer.pad_token

    print("✅ Model loaded successfully.")
    return model, tokenizer, device


# Pydantic model for request data
class ChatRequest(BaseModel):
    user_input: str

# Generate response function
def generate_response(user_input,model,tokenizer,device):
    print("Generating Response: ")
    print(user_input)
    inputs = tokenizer(f"User: {user_input}\nAssistant:", return_tensors="pt", truncation=True, max_length=512).to(device)

    with torch.inference_mode():
        output = model.generate(
            **inputs,
            max_new_tokens=10,  # Limit response length
            temperature=0.7,
            do_sample=True,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id
        )

    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response

# API Endpoint for chat
@app.post("/chat/")
async def chat(request: ChatRequest):
    model, tokenizer, device = load_model()
    response = generate_response(request.user_input,model,tokenizer,device)
    return {"response": response}

# Root endpoint
@app.get("/")
async def root():
    print("FastAPI root endpoint")
    return {"message": "LLaMA 2 Chatbot API is running!"}

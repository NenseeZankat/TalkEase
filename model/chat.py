import torch
import re
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

def load_model():
    print("🟢 Loading model...")
    model_path = "./models/models--apeksha07--Llama-2-7b-chat-finetune/snapshots/20f46d9f243ed7a2334156971dbc582ea60829c1"

    if not os.path.exists(model_path):
        raise FileNotFoundError("Model folder not found. Run `model.py` first to save the model locally.")

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32
    ).to(device)

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    print("✅ Model loaded successfully.")
    return model, tokenizer

model, tokenizer = load_model()
device = "cuda" if torch.cuda.is_available() else "cpu"

def clean_response(response):
    response = response.split("User:")[0].strip()
    match = re.search(r"^(.*[.!?])\s?", response)
    return match.group(1).strip() if match else response

def chat_with_llama2(user_input):
    print(f"🟡 Generating response for input: '{user_input}'")
    messages = [{"role": "user", "content": user_input}]
    chat_input = f"User: {user_input}\nAssistant:"

    inputs = tokenizer(chat_input, return_tensors="pt", truncation=True, max_length=512).to(device)

    model.eval()
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_length=inputs['input_ids'].shape[1] + 20,
            temperature=0.7,
            do_sample=True,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id
        )

    decoded = tokenizer.decode(output[:, inputs["input_ids"].shape[-1]:][0], skip_special_tokens=True)
    print(f"✅ Response generated: {decoded}")
    return clean_response(decoded)

if __name__ == "__main__":
    test_input = "Hello, how are you?"
    print(chat_with_llama2(test_input))

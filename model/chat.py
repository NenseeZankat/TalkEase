import torch
import re
import time
from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer
import os
from tqdm import tqdm

def load_model():
    print("🟢 Loading model...")
    model_path = "./saved_model"

    if not os.path.exists(model_path):
        raise FileNotFoundError("Model folder not found. Run `model.py` first to save the model locally.")

    tokenizer = AutoTokenizer.from_pretrained(model_path)

    device = "cuda" if torch.cuda.is_available() else "cpu"

    if device == "cuda":
        torch.cuda.empty_cache()

    print("📊 Loading model weights with 4-bit quantization...")
    with tqdm(total=100, desc="Loading Checkpoints") as pbar:
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            low_cpu_mem_usage=True,
            device_map="auto"  
        )
        pbar.update(100)

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
    chat_input = f"User: {user_input}\nAssistant:"

    inputs = tokenizer(chat_input, return_tensors="pt", truncation=True, max_length=512).to(device)

    streamer = TextStreamer(tokenizer)

    model.eval()
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_length=inputs['input_ids'].shape[1] + 100,
            temperature=0.7,
            do_sample=True,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id,
            streamer=streamer
        )

    print("\n✅ Response generated.")


if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("👋 Exiting chat. Goodbye!")
            break
        chat_with_llama2(user_input)

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

def load_model():
    model_name = "apeksha07/Llama-2-7b-chat-finetune"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32
    ).to(device)

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    return model, tokenizer

# Save model only if it doesn't already exist
if not os.path.exists("./saved_model"):
    model, tokenizer = load_model()
    model.save_pretrained("./saved_model")
    tokenizer.save_pretrained("./saved_model")
    print("✅ Model saved successfully.")
else:
    print("✅ Model already saved.")

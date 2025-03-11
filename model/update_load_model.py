import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer
import os
from tqdm import tqdm
import re

def load_model():
    model_name = "apeksha07/Llama-2-7b-chat-finetune"
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True)
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    ).to(device)
    
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    return model, tokenizer


def clean_response(response):
    response = response.split("User:")[0].strip()
    match = re.search(r"^(.*[.!?])\s?", response)
    return match.group(1).strip() if match else response


def get_tokenized_input(user_input, tokenizer, cached_inputs):
    if user_input in cached_inputs:
        return cached_inputs[user_input]
    
    chat_input = f"User: {user_input}\nAssistant:"
    inputs = tokenizer(chat_input, return_tensors="pt", truncation=True, max_length=512).to(device)
    cached_inputs[user_input] = inputs
    return inputs


def chat_with_llama2(user_input, model, tokenizer, cached_inputs):
    print(f"🟡 Generating response for input: '{user_input}'")
    inputs = get_tokenized_input(user_input, tokenizer, cached_inputs)
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
            top_p=0.95,
            streamer=streamer
        )
    
    print("\n✅ Response generated.")


if __name__ == "__main__":
    model, tokenizer = load_model()
    cached_inputs = {}
    device = "cuda" if torch.cuda.is_available() else "cpu"

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("👋 Exiting chat. Goodbye!")
            break
        chat_with_llama2(user_input, model, tokenizer, cached_inputs)

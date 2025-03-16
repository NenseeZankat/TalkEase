import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama
import whisper
from gtts import gTTS
from fastapi.responses import FileResponse
from firebase_admin import credentials, storage, initialize_app
from langdetect import detect
from googletrans import Translator

app = FastAPI()
translator = Translator()

class ChatRequest(BaseModel):
    message: str
    response_type: str

# Load LLaMA Model
model_path = "./saved_model/llama-2-7b-chat-compressed_Q4.gguf"
llm = Llama(model_path=model_path, n_ctx=2048, n_threads=8)

# Load Whisper Model for Speech-to-Text
whisper_model = whisper.load_model("base")

# # Initialize Firebase for Audio Storage
# cred = credentials.Certificate("path/to/firebase-key.json")
# initialize_app(cred, {"storageBucket": "your-bucket-name.appspot.com"})
# bucket = storage.bucket()

# Maintain chat history
chat_history = []

def upload_to_firebase(file_path, file_name):
    """Uploads audio file to Firebase Storage and returns URL"""
    blob = bucket.blob(file_name)
    blob.upload_from_filename(file_path)
    blob.make_public()
    return blob.public_url

@app.post("/chat/")
async def chat(request: ChatRequest):
    user_message = request.message.strip()
    print(user_message)

    detected_lang = detect(user_message)
    print(f"Detected Language: {detected_lang}")

    if detected_lang == "gu":
        user_message = translator.translate(user_message, src="gu", dest="en").text
        print(f"Translated to English: {user_message}")

    response_type = request.response_type.lower()
    chat_history.append(f"User: {user_message}\nAssistant:")

    prompt = "\n".join(chat_history)
    output = llm(prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
    english_response = output["choices"][0]["text"].strip()
    chat_history.append(english_response)

    final_response = english_response

    if detected_lang == "gu":
        final_response = translator.translate(english_response, src="en", dest="gu").text
        print(f"Translated Back to Gujarati: {final_response}")
    
    if response_type == "text":
        return {"response": final_response}
    
    tts_lang = "gu" if detected_lang == "gu" else "en"
        
    tts = gTTS(final_response, lang=tts_lang)
    # audio_path = "response.mp3"
    # tts.save(audio_path)
    # audio_url = upload_to_firebase(audio_path, "response.mp3")

    audio_dir = "audio_responses"
    os.makedirs(audio_dir, exist_ok=True)  
    audio_path = os.path.join(audio_dir, "response.mp3")
    tts.save(audio_path)
    
    return {"response": final_response, "audio_url": audio_path}

@app.post("/chat/audio/")
async def chat_audio(file: UploadFile = File(...), response_type: str = Form("both")):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    transcript = whisper_model.transcribe(file_path)["text"].strip()
    os.remove(file_path)  # Cleanup
    
    chat_history.append(f"User: {transcript}\nAssistant:")
    prompt = "\n".join(chat_history)
    output = llm(prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
    response = output["choices"][0]["text"].strip()
    chat_history.append(response)
    
    if response_type == "text":
        return {"response": response}
    
    # Convert text response to speech and upload to Firebase
    tts = gTTS(response)
    response_audio_path = "response.mp3"
    tts.save(response_audio_path)
    audio_url = upload_to_firebase(response_audio_path, "response.mp3")
    
    return {"response": response, "audio_url": audio_url}

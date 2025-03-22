import os
import time
from charset_normalizer import detect
import requests  # This should be a separate import
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama
import whisper
from gtts import gTTS
from fastapi.responses import FileResponse
from firebase_admin import credentials, storage, initialize_app
from dotenv import load_dotenv

from langdetect import detect
from googletrans import Translator

load_dotenv()

app = FastAPI()
translator = Translator()

class ChatRequest(BaseModel):
    message: str
    response_type: str

class AudioRequest(BaseModel):
    audio_url: str
    response_type: str = "both"
    user_id: str

# Load LLaMA Model
model_path = os.getenv("MODEL_PATH")
llm = Llama(model_path=model_path, n_ctx=2048, n_threads=8)

# Load Whisper Model for Speech-to-Text
whisper_model = whisper.load_model("large")

# Initialize Firebase for Audio Storage
cred = credentials.Certificate("./firebase-key.json")
initialize_app(cred, {"storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")})
bucket = storage.bucket()

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

    if detected_lang != "en":
        user_message = translator.translate(user_message, src=detected_lang, dest="en").text
        print(f"Translated to English: {user_message}")

    response_type = request.response_type.lower()
    chat_history.append(f"User: {user_message}\nAssistant:")

    prompt = "\n".join(chat_history)
    output = llm(prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
    english_response = output["choices"][0]["text"].strip()
    chat_history.append(english_response)

    final_response = english_response

    if detected_lang != "en":
        final_response = translator.translate(english_response, src="en", dest=detected_lang).text
        print(f"Translated Back to {detected_lang}: {final_response}")
    
    if response_type == "text":
        return {"response": final_response}
            
    tts = gTTS(final_response, lang=detected_lang)
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

@app.post("/chat/audio/file")
async def chat_audio_file(
    file: UploadFile = File(...),
    response_type: str = Form("both"),
    user_id: str = Form(...)
):
    # Save the uploaded file temporarily
    temp_file_path = f"temp_audio_{int(time.time())}.webm"
    try:
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        # Transcribe the audio
        result = whisper_model.transcribe(temp_file_path, task="transcribe")

        transcript = result["text"].strip()
        language = result["language"]

        print("extracted text :",transcript, language)

        os.remove(temp_file_path)  # Cleanup

        detected_lang = detect(transcript)
        print(f"Detected Language: {detected_lang}")

        if detected_lang != "en":
            transcript = translator.translate(transcript, src=detected_lang, dest="en").text
            print(f"Translated to English: {transcript}")
            
        # Process with LLM
        chat_history.append(f"User: {transcript}\nAssistant:")
        prompt = "\n".join(chat_history)
        output = llm(prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
        response_text = output["choices"][0]["text"].strip()
        chat_history.append(response_text)
        
        final_response = response_text

        if detected_lang != "en":
            final_response = translator.translate(response_text, src="en", dest=detected_lang).text
            print(f"Translated Back to {detected_lang}: {final_response}")

        if response_type == "text":
            return {"response": final_response}
        
        # Convert text response to speech and upload to Firebase
        tts = gTTS(final_response, lang = detected_lang)
        response_audio_path = "response.mp3"
        tts.save(response_audio_path)
        timestamp = int(time.time())
        chat_id = "1"  # You might want to make this dynamic
        audio_filename = f"audioMessages/response/response_{user_id}_{timestamp}_{chat_id}.webm"
        audio_url = upload_to_firebase(response_audio_path, audio_filename)
        os.remove(response_audio_path)  # Cleanup
        
        return {"response": response_text, "audio_url": audio_url}
    
    except Exception as e:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if os.path.exists("response.mp3"):
            os.remove("response.mp3")
        print(f"Error processing audio file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing audio file: {str(e)}")
import os
from fastapi import FastAPI,File, UploadFile , Form, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama
import whisper
from gtts import gTTS
import subprocess


app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    response_type: str

# 🔄 Load model ONCE at startup (same as test.py)
model_path = "./save_model/llama-2-7b-chat-compressed_Q4.gguf"  # Update path if needed
print(f"🔄 Loading model: {model_path}")

llm = Llama(model_path=model_path, n_ctx=2048, n_threads=8)  
print("✅ Model loaded successfully!\n")

# Load Whisper ASR Model (for speech-to-text)
whisper_model = whisper.load_model("base")  # Change to "small" or "medium" for better accuracy

# Maintain chat history for context
chat_history = []

def check_ffmpeg():
    """Ensure FFmpeg is installed and accessible."""
    try:
        subprocess.run(["ffmpeg", "-version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="FFmpeg is not installed or not in PATH.")


@app.post("/chat/")
async def chat(request: ChatRequest):
    user_message = request.message.strip()
    response_type = request.response_type.lower() # "text" or "audio or both"
    chat_history.append(f"User: {user_message}\nAssistant:")

    prompt = "\n".join(chat_history)

    print("Generating response...")
    output = llm(
        prompt,
        max_tokens=150,  
        stop=["User:", "Assistant:"],  
        temperature=0.7,
    )

    response = output["choices"][0]["text"].strip()
    
    chat_history.append(response)
    if response_type == "text":
        return {"response": response}
    # Convert response to speech (TTS)
    tts = gTTS(response)
    audio_path = "response.mp3"
    tts.save(audio_path)

    if response_type == "audio":
        return {"response":response, "audio_url": f"/{audio_path}"}

    return {"response": response, "audio_url": f"/{audio_path}"}

@app.post("/chat/audio/")
async def chat_audio(file: UploadFile = File(...), response_type: str = Form("both")):
    print("Endpoint Hit!")
    check_ffmpeg()
    
    file_path = f"temp_{file.filename}"
    try:
        # Save the uploaded file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail=f"File {file_path} not found.")

        # Convert Speech to Text
        transcript = whisper_model.transcribe(file_path)["text"].strip()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
    
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)  # Cleanup
    
    # Process chatbot response
    chat_history.append(f"User: {transcript}\nAssistant:")
    prompt = "\n".join(chat_history)
    output = llm(prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
    response = output["choices"][0]["text"].strip()
    chat_history.append(response)
    
    if response_type == "text":
        return {"response": response}
    
    # Convert response to speech (TTS)
    audio_path = "static/response.mp3"
    tts = gTTS(response)
    tts.save(audio_path)
    
    if response_type == "audio":
        return FileResponse(audio_path, media_type="audio/mpeg")
    
    return {"response": response, "audio_url": f"/{audio_path}"}


# ✅ STATIC FILES FOR AUDIO OUTPUT
from fastapi.staticfiles import StaticFiles
app.mount("/static", StaticFiles(directory="."), name="static")
@app.get("/")
async def root():
    return {"message": "LLaMA 2 Chatbot API is running!"}

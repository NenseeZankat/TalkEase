import json
import os
import time
from charset_normalizer import detect
import faiss
import requests
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama
from sentence_transformers import SentenceTransformer
import whisper
from gtts import gTTS
from fastapi.responses import FileResponse
import firebase_admin
from firebase_admin import credentials, firestore, storage, initialize_app
from dotenv import load_dotenv
from transformers import pipeline
import pandas as pd
from langdetect import detect
from googletrans import Translator
import torch

# Load environment variables
load_dotenv()
# Load emotion detection model (RoBERTa fine-tuned on GoEmotions)
emotion_model = pipeline("text-classification", model="kashyaparun/Mental-Health-Chatbot-using-RoBERTa-fine-tuned-on-GoEmotion", return_all_scores=False)

# Load mental health classification model (LLaMA 3.1 8B)
mental_health_model = pipeline("text-classification", model="kingabzpro/Llama-3.1-8B-Instruct-Mental-Health-Classification", return_all_scores=False)

# Initialize FastAPI app
app = FastAPI()
translator = Translator()
# Initialize Firebase
cred = credentials.Certificate("./firebase-key.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET"),
    'projectId': os.getenv("FIREBASE_PROJECT_ID")
})
db = firestore.client()
bucket = storage.bucket()

# Request Models
class ChatRequest(BaseModel):
    message: str
    response_type: str

class AudioRequest(BaseModel):
    audio_url: str
    response_type: str = "both"
    user_id: str
class ClassificationRequest(BaseModel):
    message: str


# Load LLaMA Model
model_path = os.getenv("MODEL_PATH")
llm = Llama(model_path=model_path, n_ctx=2048, n_threads=8)

# Load Whisper Model for Speech-to-Text
whisper_model = whisper.load_model("large")

# Maintain chat history
chat_history = []

# Initialize Sentence Transformer for embeddings
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Faiss Index Configuration
FAISS_INDEX_FILE = "faiss_index.index"

def load_frequent_questions():
    """Load frequently asked questions from Firestore"""
    faq_ref = db.collection('frequent_questions')
    faq_docs = faq_ref.stream()
    
    questions = {}
    for doc in faq_docs:
        questions[doc.id] = doc.to_dict()
    
    return questions

def save_frequent_questions(question, data):
    """Save frequently asked question to Firestore"""
    faq_ref = db.collection('frequent_questions')
    
    # Normalize the question to use as document ID
    doc_id = question.lower().strip()
    
    # Update or create the document
    faq_ref.document(doc_id).set(data)

def update_frequent_questions(question, response):
    """
    Update frequency of asked questions and store in Faiss if asked more than 3 times
    
    Args:
        question (str): The question asked by the user
        response (str): The response generated for the question
    """
    # Retrieve existing frequent questions
    questions = load_frequent_questions()
    
    # Normalize the question
    normalized_question = question.lower().strip()
    
    # Update question frequency
    if normalized_question in questions:
        current_count = questions[normalized_question].get('count', 0)
        data = {
            'count': current_count + 1,
            'response': response
        }
    else:
        data = {
            'count': 1,
            'response': response
        }
    
    # Save to Firestore
    save_frequent_questions(normalized_question, data)
    
    # If a question is asked more than 3 times, add to Faiss
    if data['count'] > 3:
        add_to_faiss(normalized_question, response)
        print(f"Added to Faiss database: {normalized_question}")

def initialize_faiss_index():
    """Initialize or load Faiss index, potentially using Firebase Storage"""
    # Try to download index from Firebase Storage if exists
    try:
        blob = bucket.blob(FAISS_INDEX_FILE)
        blob.download_to_filename(FAISS_INDEX_FILE)
        index = faiss.read_index(FAISS_INDEX_FILE)
        return index
    except Exception:
        # Create new index if no existing index
        dimension = embedding_model.get_sentence_embedding_dimension()
        index = faiss.IndexFlatL2(dimension)
        return index

def add_to_faiss(question, response=None):
    """Add question to Faiss index and upload to Firebase Storage"""
    index = initialize_faiss_index()
    
    # Generate embedding
    embedding = embedding_model.encode([question])[0]
    
    # Add embedding to index
    faiss.normalize_L2(embedding.reshape(1, -1))
    index.add(embedding.reshape(1, -1))
    
    # Save index locally
    faiss.write_index(index, FAISS_INDEX_FILE)
    
    # Upload to Firebase Storage
    blob = bucket.blob(FAISS_INDEX_FILE)
    blob.upload_from_filename(FAISS_INDEX_FILE)
    
    # Store metadata in Firestore
    faq_metadata_ref = db.collection('faiss_metadata')
    faq_metadata_ref.add({
        'question': question,
        'response': response,
        'timestamp': firestore.SERVER_TIMESTAMP
    })

def search_faiss(query, top_k=1):
    """Search Faiss index for similar questions"""
    index = initialize_faiss_index()
    
    if index.ntotal == 0:
        return None
    
    # Generate embedding for query
    query_embedding = embedding_model.encode([query])[0]
    faiss.normalize_L2(query_embedding.reshape(1, -1))
    
    # Search index
    D, I = index.search(query_embedding.reshape(1, -1), top_k)
    
    # If similarity is below a threshold, return None
    if D[0][0] > 1.0:  # Adjust threshold as needed
        return None
    
    # Retrieve metadata from Firestore
    faq_metadata_ref = db.collection('faiss_metadata')
    query_ref = faq_metadata_ref.where('question', '==', query).limit(1)
    docs = query_ref.stream()
    
    for doc in docs:
        return doc.to_dict()
    
    return None

def generate_llm_response(prompt):
    """Generate response using LLM"""
    chat_history.append(f"User: {prompt}\nAssistant:")
    full_prompt = "\n".join(chat_history)
    output = llm(full_prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
    response = output["choices"][0]["text"].strip()
    chat_history.append(response)
    return response

@app.get("/test")
async def test():
    return {"message": "Model is working"}

@app.post("/chat/")
async def chat(request: ChatRequest):
    user_message = request.message.strip()
    faiss_message = user_message
    print(user_message)

    # Check Faiss for similar questions first
    faiss_result = search_faiss(user_message)
    if faiss_result:
        print("Request found in Faiss database")
        return {"response": faiss_result['response'] or "I found a similar question in my database."}

    detected_lang = detect(user_message)
    print(f"Detected Language: {detected_lang}")

    if detected_lang != "en":
        user_message = translator.translate(user_message, src=detected_lang, dest="en").text
        print(f"Translated to English: {user_message}")

    response_type = request.response_type.lower()

    # Generate response
    english_response = generate_llm_response(user_message)
    final_response = english_response

  

    if detected_lang != "en":
        final_response = translator.translate(english_response, src="en", dest=detected_lang).text
        print(f"Translated Back to {detected_lang}: {final_response}")
    
    # Update frequent questions with the generated response
    update_frequent_questions(faiss_message, final_response)
    
    if response_type == "text":
        return {"response": final_response}
            
    tts = gTTS(final_response, lang=detected_lang)
    
    audio_dir = "audio_responses"
    os.makedirs(audio_dir, exist_ok=True)  
    audio_path = os.path.join(audio_dir, "response.mp3")
    tts.save(audio_path)
    
    return {"response": final_response, "audio_url": audio_path}

@app.post("/add_frequent_question/")
async def add_frequent_question(question: str, response: str):
    """Manually add a frequently asked question to Firestore and Faiss"""
    add_to_faiss(question, response)
    
    # Update frequent questions in Firestore
    save_frequent_questions(question, {
        'count': 5,  # Set to 5 to trigger Faiss addition
        'response': response
    })
    
    return {"status": "Question added successfully"}

@app.get("/frequent_questions/")
async def get_frequent_questions():
    """Retrieve frequently asked questions from Firestore"""
    return load_frequent_questions()

# Optional: Speech-to-Text endpoint
@app.post("/transcribe/")
async def transcribe_audio(audio_file: UploadFile = File(...)):
    """Transcribe audio file using Whisper"""
    # Save uploaded file temporarily
    with open("temp_audio.mp3", "wb") as buffer:
        buffer.write(await audio_file.read())
    
    # Transcribe audio
    result = whisper_model.transcribe("temp_audio.mp3")
    
    # Optional: Remove temporary file
    os.remove("temp_audio.mp3")
    
    return {"transcription": result["text"]}


def upload_to_firebase(file_path, file_name):
    """Uploads audio file to Firebase Storage and returns URL"""
    blob = bucket.blob(file_name)
    blob.upload_from_filename(file_path)
    blob.make_public()
    return blob.public_url


@app.get("/test")
async def test():
    return {"message": "Model is working"}

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

        if language != "en":
            transcript = translator.translate(transcript, src=language, dest="en").text
            print(f"Translated to English: {transcript}")
            
        # Process with LLM
        chat_history.append(f"User: {transcript}\nAssistant:")
        prompt = "\n".join(chat_history)
        faiss_result = search_faiss(transcript)
        if faiss_result:
            print("Request found in Faiss database")
            response_text = faiss_result['response']
        else:
            output = llm(prompt, max_tokens=150, stop=["User:", "Assistant:"], temperature=0.7)
            response_text = output["choices"][0]["text"].strip()

        chat_history.append(response_text)
        
        final_response = response_text

        if language != "en":
            final_response = translator.translate(response_text, src="en", dest=language).text
            print(f"Translated Back to {language}: {final_response}")

        if response_type == "text":
            return {"response": final_response}
        
        # Convert text response to speech and upload to Firebase
        tts = gTTS(final_response, lang = language)
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
@app.post("/analyze/")
async def analyze(request: ClassificationRequest):
    user_message = request.message.strip()
    
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    # Get emotion classification
    emotion_result = emotion_model(user_message)
    emotion = emotion_result[0]["label"]
    
    # Get mental health classification
    mental_health_result = mental_health_model(user_message)
    mental_health_status = mental_health_result[0]["label"]
    
    return {
        "emotion": emotion,
        "mental_health_status": mental_health_status
    }

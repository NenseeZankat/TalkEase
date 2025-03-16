import ChatHistory from "../models/ChatHistory.js";
import faiss from "faiss-node";
import axios from "axios";

const d = 128; 
const index = new faiss.IndexFlatL2(d); 

export const generateResponse = async (req, res) => {
    try {
        console.log(req.body);
        const { userMessage, userId, responseType } = req.body; // Get userMessage and responseType from the request

        // Validate responseType (either "text", "audio", or "both")
        if (!['text', 'audio', 'both'].includes(responseType)) {
            return res.status(400).json({ msg: "Invalid response type. It should be 'text', 'audio', or 'both'." });
        }

        // Send the message to the FastAPI for response generation
        const fastApiResponse = await axios.post("http://localhost:8000/chat/", {
            message: userMessage,
            response_type: responseType  // Pass the user response type to FastAPI
        });

        const botResponse = fastApiResponse.data.response;
        let audioUrl = null;

        // If response type is 'audio' or 'both', handle audio URL
        if (responseType === 'audio' || responseType === 'both') {
            audioUrl = fastApiResponse.data.audio_url; // FastAPI returns audio_url for audio responses
        }

        // Save chat history in database
        const newChat = new ChatHistory({ userId, userMessage, botResponse });
        await newChat.save();

        // Send the response back with either text or audio URL (or both)
        res.json({ botResponse, audioUrl, msg: "Chat history saved successfully" });
    } catch (err) {
        console.error("Error in generateResponse:", err.message);
        res.status(500).json({ error: err.message });
    }
};
export const semanticSearch = async (req, res) => {
    try {
        const { embedding } = req.body;

        if (embedding.length !== 128) {
            return res.status(400).json({ msg: "Invalid embedding size" });
        }

        const k = 5; 
        const distances = new Float32Array(k);
        const indices = new Int32Array(k);

        // Perform FAISS semantic search (currently uses FAISS index)
        index.search(new Float32Array(embedding), k, distances, indices);

        const chats = await ChatHistory.find({ _id: { $in: Array.from(indices) } });

        res.json({ chats, distances: Array.from(distances) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await ChatHistory.find({ userId }).select("userMessage botResponse -_id");

        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const axios = require("axios");
const multer = require("multer");
const express = require("express");
const FormData = require("form-data");
const fs = require("fs");
const firebaseAdmin = require("firebase-admin");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const FASTAPI_URL = "http://localhost:8000/chat";

// Initialize Firebase Admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert("path/to/firebase-key.json"),
  storageBucket: "your-bucket-name.appspot.com"
});
const bucket = firebaseAdmin.storage().bucket();

// Handle text-based chat request
router.post("/text", async (req, res) => {
    try {
        const { message, responseType } = req.body;
        const response = await axios.post(`${FASTAPI_URL}/`, { message, response_type: responseType });
        res.json(response.data);
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Error processing chat request." });
    }
});

// Handle audio-based chat request
router.post("/audio", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded." });
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));
        formData.append("response_type", req.body.responseType || "both");

        // Store user audio in Firebase
        const userAudioUrl = await uploadAudioToFirebase(req.file.path, req.file.originalname);

        const response = await axios.post(`${FASTAPI_URL}/audio/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Clean up uploaded file after processing
        fs.unlinkSync(req.file.path);

        // Fetch the assistant's audio response URL
        const assistantAudioUrl = response.data.audio_url;
        
        // Store response in MongoDB (Assuming MongoDB is already connected and set up)

        // Now delete the uploaded user and assistant audio files from Firebase
        await deleteAudioFromFirebase(req.file.originalname);
        await deleteAudioFromFirebase(response.data.audio_url);

        // Return user audio and assistant audio URL along with text response
        res.json({
            user_audio_url: userAudioUrl,
            assistant_audio_url: assistantAudioUrl,
            response: response.data.response,
        });
    } catch (error) {
        console.error("Audio Chat Error:", error);
        res.status(500).json({ error: "Error processing audio chat request." });
    }
});

// Helper function to upload audio to Firebase
async function uploadAudioToFirebase(filePath, fileName) {
    const blob = bucket.file(fileName);
    await bucket.upload(filePath, {
        destination: fileName,
        metadata: { contentType: 'audio/mpeg' },
    });

    // Make the file public and return the URL
    await blob.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

// Helper function to delete audio from Firebase
async function deleteAudioFromFirebase(fileName) {
    const file = bucket.file(fileName);
    await file.delete();
    console.log(`File ${fileName} deleted from Firebase Storage`);
}

module.exports = router;

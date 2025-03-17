import ChatHistory from "../models/ChatHistory.js";
import faiss from "faiss-node";
import axios from "axios";
import multer from "multer";
import FormData from 'form-data';

const d = 128; 
const index = new faiss.IndexFlatL2(d); 

export const generateResponse = async (req, res) => {
    try {
        console.log(req.body);
        const { userMessage, userId, responseType } = req.body;

        // Validate responseType (either "text", "audio", or "both")
        if (!['text', 'audio', 'both'].includes(responseType)) {
            return res.status(400).json({ msg: "Invalid response type. It should be 'text', 'audio', or 'both'." });
        }

        let fastApiResponse;
        
        // Check if this is a text message or an audio message
        if (typeof userMessage === 'string' || !userMessage.isAudio) {
            // Handle text message
            try {
                fastApiResponse = await axios.post("http://localhost:8000/chat/", {
                    message: typeof userMessage === 'string' ? userMessage : userMessage.content,
                    response_type: responseType
                });
            } catch (error) {
                console.error("FastAPI Error:", error.response ? error.response.data : error.message);
                throw new Error("Failed to communicate with FastAPI service: " + 
                               (error.response ? JSON.stringify(error.response.data) : error.message));
            }
        } else {
            // Handle audio message
            try {
                fastApiResponse = await axios.post("http://localhost:8000/chat/audio/", {
                    audio_url: userMessage.audioUrl,
                    response_type: responseType,
                    user_id: userId
                });
            } catch (error) {
                console.error("FastAPI Audio Error:", error.response ? error.response.data : error.message);
                throw new Error("Failed to process audio message: " + 
                               (error.response ? JSON.stringify(error.response.data) : error.message));
            }
        }

        // Get the response content
        const botResponse = fastApiResponse.data.response;
        let audioUrl = null;

        // If response type is 'audio' or 'both', handle audio URL
        if ((responseType === 'audio' || responseType === 'both') && fastApiResponse.data.audio_url) {
            audioUrl = fastApiResponse.data.audio_url;
        }

        // Save chat history in database
        const newChat = new ChatHistory({ 
            userId, 
            userMessage: typeof userMessage === 'string' ? userMessage : userMessage.content, 
            botResponse 
        });
        await newChat.save();

        // Send the response back with either text or audio URL (or both)
        res.json({ botResponse, audioUrl, msg: "Chat history saved successfully" });
    } catch (err) {
        console.error("Error in generateResponse:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// Set up multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Export multer middleware separately so it can be used in route definition
export const uploadMiddleware = upload.single('audio_file');

// Audio processing function (fixed the syntax)
export const generateAudio = async (req, res) => {
  try {
    const audioFile = req.file;
    const responseType = req.body.response_type || 'both';
    const userId = req.body.user_id;
    
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    // Create a FormData object to send to FastAPI
    const formData = new FormData();
    formData.append('file', audioFile.buffer, {
      filename: 'audio-message.webm',
      contentType: audioFile.mimetype
    });
    formData.append('response_type', responseType);
    formData.append('user_id', userId);
    
    // Send the file to FastAPI endpoint
    let fastApiResponse;
    try {
      fastApiResponse = await axios.post(
        'http://localhost:8000/chat/audio/file', 
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      );
    } catch (error) {
      console.error("FastAPI File Upload Error:", error.response ? error.response.data : error.message);
      throw new Error("Failed to process audio file: " + 
                     (error.response ? JSON.stringify(error.response.data) : error.message));
    }
    
    const botResponse = fastApiResponse.data.response;
    let audioUrl = null;
    
    if ((responseType === 'audio' || responseType === 'both') && fastApiResponse.data.audio_url) {
      audioUrl = fastApiResponse.data.audio_url;
    }
    
    // Save chat history in database
    const newChat = new ChatHistory({ 
      userId, 
      userMessage: "Audio message", // Or you could use the transcript if FastAPI returns it
      botResponse 
    });
    await newChat.save();
    
    // Send the response back
    res.json({ botResponse, audioUrl, msg: "Chat history saved successfully" });
  } catch (err) {
    console.error("Error processing audio message:", err.message);
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
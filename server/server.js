import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import chatrouter from "./routes/chatRoutes.js";
import userrouter from "./routes/userRoutes.js";
import dotenv from "dotenv";
import ChatHistory from "./models/ChatHistory.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use("/api/user", userrouter);
app.use("/api/chat", chatrouter);

// New Express endpoint for handling audio files
import multer from "multer";
import axios from "axios";



// Add this new route to your Express app
app.post('/api/chat/audio-message', upload.single('audio_file'), async (req, res) => {
  try {
    const audioFile = req.file;
    const responseType = req.body.response_type || 'both';
    const userId = req.body.user_id;
    const chatCategoryId = req.body.chatCategoryId;
   
    if (!audioFile) {
        return res.status(400).json({ error: "No audio file provided" });
    }
    if (!chatCategoryId) {
        return res.status(400).json({ error: "chatCategoryId is required" });
    }
    
    // Create a FormData object to send to FastAPI
    const formData = new FormData();
    formData.append('file', new Blob([audioFile.buffer]), 'audio-message.webm');
    formData.append('response_type', responseType);
    formData.append('user_id', userId);
    
    // Send the file to FastAPI endpoint
    const fastApiResponse = await axios.post(
      'http://localhost:8000/chat/audio/file', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    const botResponse = fastApiResponse.data.response;
    let audioUrl = fastApiResponse.data.audio_url || null;

    const newChat = new ChatHistory({
        chatCategoryId,
        userId,
        userMessage: "Audio message",
        botResponse,
        isAudio:true,
        audioUrl,
    });
    await newChat.save();
    
    res.json({ botResponse, audioUrl, msg: "Chat history saved successfully" });
  } catch (err) {
    console.error("Error processing audio message:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server running on ${url}`);
});

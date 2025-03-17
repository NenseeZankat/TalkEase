import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import chatrouter from "./routes/chatRoutes.js";
import userrouter from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userrouter);
app.use("/api/chat", chatrouter);

// New Express endpoint for handling audio files
import multer from "multer";
import axios from "axios";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Add this new route to your Express app
app.post('/api/chat/audio-message', upload.single('audio_file'), async (req, res) => {
  try {
    const audioFile = req.file;
    const responseType = req.body.response_type || 'both';
    const userId = req.body.user_id;
    
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
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
    let audioUrl = null;
    
    if ((responseType === 'audio' || responseType === 'both') && fastApiResponse.data.audio_url) {
      audioUrl = fastApiResponse.data.audio_url;
    }
    
    // Save chat history in database
    // const newChat = new ChatHistory({ 
    //   userId, 
    //   userMessage: "Audio message", // Or you could use the transcript if FastAPI returns it
    //   botResponse 
    // });
    // await newChat.save();
    
    // Send the response back
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

import ChatHistory from "../models/ChatHistory.js";
import faiss from "faiss-node";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const d = 128;
const index = new faiss.IndexFlatL2(d);

export const generateResponse = async (req, res) => {
    try {
        console.log(req.body);
        const { userMessage, userId, responseType, chatCategoryId ,timestamp, messageLabel } = req.body;

        if (!chatCategoryId) {
            return res.status(400).json({ msg: "chatCategoryId is required." });
        }

        if (!["text", "audio", "both"].includes(responseType)) {
            return res.status(400).json({ msg: "Invalid response type. It should be 'text', 'audio', or 'both'." });
        }

        let fastApiResponse;

        try {
            fastApiResponse = await axios.post("http://localhost:8000/chat/", {
                message: userMessage,
                response_type: responseType,
            });
        } catch (error) {
            console.error("FastAPI Error:", error.response ? error.response.data : error.message);
            throw new Error("Failed to communicate with FastAPI service.");
        }

        const botResponse = fastApiResponse.data.response;
        let audioUrl = fastApiResponse.data.audio_url || null;

        const newChat = new ChatHistory({
            chatCategoryId,
            userId,
            userMessage,
            botResponse,
            timestamp,
            messageLabel,
            isAudio:false,
        });
        await newChat.save();

        res.json({ botResponse, audioUrl, msg: "Chat history saved successfully" });
    } catch (err) {
        console.error("Error in generateResponse:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// Set up multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Export multer middleware for file uploads
export const uploadMiddleware = upload.single("audio_file");

// Generate Audio Response Function
export const generateAudio = async (req, res) => {
    try {
        const { response_type, user_id, chatCategoryId } = req.body;
        const audioFile = req.file;
        console.log(req.body)
        if (!audioFile) {
            return res.status(400).json({ error: "No audio file provided" });
        }
        if (!chatCategoryId) {
            return res.status(400).json({ error: "chatCategoryId is required" });
        }

        const formData = new FormData();
        formData.append("file", audioFile.buffer, {
            filename: "audio-message.webm",
            contentType: audioFile.mimetype,
        });
        formData.append("response_type", response_type);
        formData.append("user_id", user_id);

        let fastApiResponse;
        try {
            fastApiResponse = await axios.post("http://localhost:8000/chat/audio/file", formData, {
                headers: { ...formData.getHeaders() },
            });
        } catch (error) {
            console.error("FastAPI File Upload Error:", error.response ? error.response.data : error.message);
            throw new Error("Failed to process audio file.");
        }

        const botResponse = fastApiResponse.data.response;
        let audioUrl = fastApiResponse.data.audio_url || null;

        const newChat = new ChatHistory({
            chatCategoryId,
            userId: user_id,
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
};

export const semanticSearch = async (req, res) => {
    try {
        const { embedding } = req.body;

        if (!embedding || embedding.length !== d) {
            return res.status(400).json({ msg: "Invalid embedding size" });
        }

        const k = 5;
        const distances = new Float32Array(k);
        const indices = new Int32Array(k);

        // Perform FAISS search
        index.search(new Float32Array(embedding), k, distances, indices);

        // Retrieve actual chat history records
        const chatIds = Array.from(indices).filter((id) => id >= 0); // Remove invalid indices
        const chats = await ChatHistory.find({ _id: { $in: chatIds } });

        res.json({ chats, distances: Array.from(distances) });
    } catch (err) {
        console.error("Error in semanticSearch:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { userId, chatCategoryId } = req.params;

        if (!chatCategoryId) {
            return res.status(400).json({ msg: "chatCategoryId is required" });
        }

        const chats = await ChatHistory.find({ userId, chatCategoryId }).select("userMessage botResponse timestamp isAudio audioUrl -_id");
        res.json(chats);
    } catch (err) {
        console.error("Error in getChatHistory:", err.message);
        res.status(500).json({ error: err.message });
    }
};

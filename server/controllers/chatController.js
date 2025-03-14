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




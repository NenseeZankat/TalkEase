import ChatHistory from "../models/ChatHistory.js";
import faiss from "faiss-node";
import axios from "axios";

const d = 128; 
const index = new faiss.IndexFlatL2(d); 

export const saveChatHistory = async (req, res) => {
    try {
        const { userId, userMessage, botResponse, embedding } = req.body;

        if (embedding.length !== d) {
            return res.status(400).json({ msg: "Invalid embedding size" });
        }

        const newChat = new ChatHistory({
            userId,
            userMessage,
            botResponse,
            embeddings: embedding
        });

        await newChat.save();

        // Add the new chat's embedding to FAISS index
        index.add(new Float32Array(embedding));

        res.status(201).json({ msg: "Chat history saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const semanticSearch = async (req, res) => {
    try {
        const { embedding } = req.body;

        if (embedding.length !== d) {
            return res.status(400).json({ msg: "Invalid embedding size" });
        }

        const k = 5; // Number of similar results to fetch
        const distances = new Float32Array(k);
        const indices = new Int32Array(k);

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
        const chats = await ChatHistory.find({ userId });

        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const generateResponse = async (req, res) => {
    try {
      console.log(req.body);
      const { userMessage } = req.body;
      const fastApiResponse = await axios.get("http://localhost:8000/");
      const botResponse = fastApiResponse.data.message;
      res.json({ botResponse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

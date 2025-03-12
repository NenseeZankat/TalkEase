import ChatHistory from "../models/ChatHistory.js";
import faiss from "faiss-node";
import axios from "axios";

const d = 128; 
const index = new faiss.IndexFlatL2(d); 

export const generateResponse = async (req, res) => {
    try {
        console.log(req.body);
        const { userMessage } = req.body;
        const userId = "67d0f62f2ccabd9b4858e279";

        // if (embedding==undefined && embedding.length !== d) {
        //     return res.status(400).json({ msg: "Invalid embedding size" });
        // }

        const fastApiResponse = await axios.post("http://localhost:8000/chat/", { message: userMessage });
        const botResponse = fastApiResponse.data.response;

        const newChat = new ChatHistory({ userId, userMessage, botResponse });
        await newChat.save();

        // if (embedding && embedding.length === d) {
        //     index.add(new Float32Array(embedding));
        // }

        res.json({ botResponse, msg: "Chat history saved successfully" });
    } catch (err) {
        console.error("Error in generateResponse:", err.message);
        res.status(500).json({ error: err.message });
    }
};


export const semanticSearch = async (req, res) => {
    try {
        const { embedding } = req.body;

        if (embedding.length !== d) {
            return res.status(400).json({ msg: "Invalid embedding size" });
        }

        const k = 5; 
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
        const chats = await ChatHistory.find({ userId }).select("userMessage botResponse -_id");

        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




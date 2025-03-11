const ChatHistory = require("../models/ChatHistory");
const faiss = require("faiss-node");

const d = 128; // Dimension of embeddings
const index = new faiss.IndexFlatL2(d);  // Initialize FAISS index

// Save Chat History and Embedding
exports.saveChatHistory = async (req, res) => {
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

// Semantic Search for Chat History
exports.semanticSearch = async (req, res) => {
  try {
    const { embedding } = req.body;

    if (embedding.length !== d) {
      return res.status(400).json({ msg: "Invalid embedding size" });
    }

    const k = 5;  // Number of similar results to fetch
    const distances = new Float32Array(k);
    const indices = new Int32Array(k);

    // Search FAISS index for the closest matches
    index.search(new Float32Array(embedding), k, distances, indices);

    // Convert indices to actual chat records from DB
    const chats = await ChatHistory.find({ _id: { $in: Array.from(indices) } });
    
    res.json({ chats, distances: Array.from(distances) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all chat history for a user
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await ChatHistory.find({ userId });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

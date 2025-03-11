const express = require("express");
const router = express.Router();
const { saveChatHistory, semanticSearch, getChatHistory } = require("../controllers/chatController");

// Save chat history
router.post("/save-chat", saveChatHistory);

// Semantic search for similar chats
router.post("/semantic-search", semanticSearch);

// Get all chat history for a specific user
router.get("/history/:userId", getChatHistory);

module.exports = router;

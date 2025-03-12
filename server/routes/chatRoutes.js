import express from "express";
import { semanticSearch, getChatHistory, generateResponse } from "../controllers/chatController.js";

const chatrouter = express.Router();

// chatrouter.post("/save-chat", saveChatHistory);

chatrouter.post("/semantic-search", semanticSearch);

chatrouter.get("/history/:userId", getChatHistory);

chatrouter.post("/generate-response", generateResponse);

export default chatrouter;

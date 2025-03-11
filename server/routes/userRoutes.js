import express from "express";
import { saveChatHistory, semanticSearch, getChatHistory } from "../controllers/chatController.js";
import { registerUser, loginUser, findSimilarUsers, updateUser, getAllUsers, getUserById } from "../controllers/userController.js";

const userrouter = express.Router();

// Save chat history
userrouter.post("/save-chat", saveChatHistory);

// Semantic search for similar chats
userrouter.post("/semantic-search", semanticSearch);

// Get all chat history for a specific user
userrouter.get("/history/:userId", getChatHistory);

// Register User
userrouter.post("/register", registerUser);

// Login User
userrouter.post("/login", loginUser);

// Find Similar Users
userrouter.post("/find-similar", findSimilarUsers);

// Update User
userrouter.put("/update/:id", updateUser);

// Fetch All Users
userrouter.get("/all-users", getAllUsers);

// Find User by ID
userrouter.get("/user/:id", getUserById);

export default userrouter;

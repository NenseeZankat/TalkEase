import ChatCategory from "../models/ChatCategory.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
import Message from "../models/Message.js";

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is missing. Please set it in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });


export const createChatCategory = async (req, res) => {
    try {
        const { userId, topic } = req.body;
        
        const chatCategory = new ChatCategory({ userId, topic });
        await chatCategory.save();
        
        // Send response with the category ID specifically highlighted
        res.status(201).json({
            success: true,
            chatId: chatCategory._id,
            category: chatCategory
        });
    } catch (error) {
        console.error("Error creating chat category:", error.message);
        res.status(500).json({ 
            success: false, 
            msg: "Failed to create chat category.", 
            error: error.message 
        });
    }
};
export const getChatCategoriesByUser = async (req, res) => {
    try {
        const chatCategories = await ChatCategory.find({ userId: req.params.userId });

        console.log(`Found ${chatCategories.length} chat categories for user: ${req.params.userId}`);
        res.status(200).json(chatCategories);
    } catch (error) {
        console.error("Error fetching chat categories:", error.message);
        res.status(500).json({ msg: "Failed to get chat categories.", error: error.message });
    }
};

export const deleteChatCategory = async (req, res) => {
    try {

        const chatCategory = await ChatCategory.findById(req.params.id);
        if (!chatCategory) {
            console.log(`Chat category not found: ${req.params.id}`);
            return res.status(404).json({ msg: "Chat category not found." });
        }

        await chatCategory.deleteOne();
        console.log(`Chat category deleted successfully: ${req.params.id}`);

        res.status(200).json({ msg: "Chat category deleted." });
    } catch (error) {
        console.error("Error deleting chat category:", error.message);
        res.status(500).json({ msg: "Failed to delete chat category.", error: error.message });
    }
};

export const updateChatCategory = async (req, res) => {
    try {
        const chatCategory = await ChatCategory.findById(req.params.id);
        if (!chatCategory) {
            console.log(`Chat category not found: ${req.params.id}`);
            return res.status(404).json({ msg: "Chat category not found." });
        }

        chatCategory.topic = req.body.topic;
        await chatCategory.save();

        console.log(`Chat category updated successfully: ${req.params.id}`);
        res.status(200).json(chatCategory);
    } catch (error) {
        console.error("Error updating chat category:", error.message);
        res.status(500).json({ msg: "Failed to update chat category.", error: error.message });
    }
};

export const classifyMessage = async (req, res) => {
    console.log("Classifying message:", req.body.message);
    const { message } = req.body;
    const { chatCategoryId , userId } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Step 1: Classify the message category using Gemini API
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts : [
                        {
                          text: `Classify the following message strictly into one of these categories only: Tech, Mental Health, General Talk, Knowledge, Entertainment, or Other. 
                      Do not create or use any subcategories. Only return one category exactly as listed.
                      
                      Message: "${message}"`
                        }
                      ]
                      
                },
            ],
        });

        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        console.log("Response from Gemini API: ", responseText);

        if (!responseText) {
            throw new Error("Invalid response from Gemini API");
        }

        // Step 2: Always perform emotion analysis with FastAPI
        console.log(`Analyzing emotion for message in category: ${responseText}`);
        
        try {
            const fastApiResponse = await axios.post("http://127.0.0.1:8000/analyze/", {
                message: message
            });
            console.log("FastAPI Response:", fastApiResponse.data);
            
            // Step 3: Prepare the combined response data
            const savedData = new Message({
                category: responseText,
                mood: fastApiResponse.data.emotion,
                userId: userId || null,
                userMessage: message,
                responseType: 'text',
                chatCategoryId: chatCategoryId || null,
                timestamp: new Date().toISOString(),
                messageLabel: responseText
            });

            await savedData.save();

            // Optional: Save to database
            // Save to database

            return res.json(savedData);
            
        } catch (fastApiError) {
            console.error("Error calling FastAPI for emotion analysis:", fastApiError);
            // Still return category without emotion if FastAPI fails
            return res.json({ 
                category: responseText,
                mood: "unknown",
                error: "Failed to analyze emotion"
            });
        }

    } catch (error) {
        console.error("Error classifying message:", error);
        res.status(500).json({ error: "Error classifying message" });
    }
};
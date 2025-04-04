import express from "express";
import { semanticSearch, getChatHistory, generateResponse , generateAudio, getChatAnalysis} from "../controllers/chatController.js";
import { createChatCategory, deleteChatCategory, getChatCategoriesByUser, updateChatCategory ,classifyMessage} from "../controllers/chatCategoryController.js";
import multer from "multer";

const chatrouter = express.Router();
const upload = multer(); 


// chatrouter.post("/save-chat", saveChatHistory);

chatrouter.post("/semantic-search", semanticSearch);

chatrouter.get("/history/:userId/:chatCategoryId", getChatHistory);

chatrouter.post("/generate-response", generateResponse);

chatrouter.post("/audio-message", upload.single('audio_file') , generateAudio)

chatrouter.post("/create-category/", createChatCategory);

chatrouter.get("/categoryByUser/:userId", getChatCategoriesByUser);

chatrouter.put("/updatecategory/:id", updateChatCategory);

chatrouter.delete("/category/:id", deleteChatCategory);
chatrouter.post("/classify", classifyMessage);

chatrouter.get("/get-analytic/:userId/:chatCategoryId", getChatAnalysis);

export default chatrouter;

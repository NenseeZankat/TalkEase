import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chatCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatCategory", required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    embeddings: { type: [Number]}, 
    isAudio:{type : Boolean},
    audioUrl : {type : String}
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;

const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    embeddings: { type: [Number], required: true },  // To store embedding for semantic search
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

module.exports = ChatHistory;

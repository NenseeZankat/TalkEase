import mongoose from "mongoose";

const chatCategorySchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      topic: { type: String, required: true }, 
    },
    { timestamps: true }
  );

const ChatCategory = mongoose.model("ChatCategory", chatCategorySchema);
export default ChatCategory;
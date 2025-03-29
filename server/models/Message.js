// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Mental Health', 'General Talk', 'Knowledge', 'Other']
  },
  mood: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userMessage: {
    type: String,
    required: true
  },
  responseType: {
    type: String,
    default: 'text',
    enum: ['text', 'audio', 'image', 'video', 'file']
  },
  chatCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatCategory',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  messageLabel: {
    type: String,
    required: true
  }
}, { timestamps: true }); // This adds createdAt and updatedAt fields

// Create and export the model
const Message = mongoose.model('Message', messageSchema);

export default Message;
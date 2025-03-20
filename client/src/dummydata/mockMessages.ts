import axios from 'axios';
import { Message } from "../models/Message";

interface ChatHistoryResponse {
  _id: string;
  userId: string;
  chatCategoryId: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
  embeddings?: number[];
  createdAt: string;
  updatedAt: string;
  isAudio:boolean;
  audiUrl:string;
}

export const fetchChatMessages = async (userId: string, chatCategoryId: string): Promise<Message[]> => {
  try {
    // Assuming your API endpoint follows RESTful conventions
    const response = await axios.get<ChatHistoryResponse[]>(
      `http://localhost:5000/api/chat/history/${userId}/${chatCategoryId}`
    );
    
    // Transform backend data to match the frontend Message model
    const messages: Message[] = [];
    
    response.data.forEach((item) => {
      // Add user message
      messages.push({
        id: `user-${item._id}`,
        content: item.userMessage,
        sender: "user",
        timestamp: new Date(item.timestamp),
        reactions: [],
        isAudio:item.isAudio,
        audioUrl:item.audiUrl,
      });
      
      // Add AI response
      messages.push({
        id: `ai-${item._id}`,
        content: item.botResponse,
        sender: "ai",
        timestamp: new Date(item.timestamp),
        reactions: []
      });

    });
    if(!messages)
      return messages;
    
    // Sort messages by timestamp
    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

// Example usage:
// const messages = await fetchChatMessages('user123', 'category456');y
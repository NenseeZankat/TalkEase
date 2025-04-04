import axios from 'axios';
import { Message } from "../models/Message";

interface ChatHistoryResponse {
  userMessage: string;
  botResponse: string;
  timestamp: string;
  isAudio: boolean;
  audioUrl?: string;
  userAudioUrl?: string;
}

export const fetchChatMessages = async (userId: string, chatCategoryId: string): Promise<Message[]> => {
  try {
    const response = await axios.get<ChatHistoryResponse[]>(
      `http://localhost:5000/api/chat/history/${userId}/${chatCategoryId}`
    );

    const messages: Message[] = [];

    response.data.forEach((item, index) => {
      const timestamp = new Date(item.timestamp);
      
      // User message
      messages.push({
        id: `user-${index}`,
        content: item.userMessage,
        sender: "user",
        timestamp,
        reactions: [],
        isAudio: item.isAudio,
        audioUrl: item.userAudioUrl || ''
      });

      // Bot response
      messages.push({
        id: `ai-${index}`,
        content: item.botResponse,
        sender: "ai",
        timestamp,
        reactions: [],
        isAudio: item.isAudio,
        audioUrl: item.audioUrl || '',
      });
    });

    // Sort messages by timestamp
    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

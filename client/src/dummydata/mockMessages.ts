import { Message } from "../models/Message";

export const mockMessages: Message[] = [
    {
      id: "msg1",
      content: "Hi there, I'm feeling really down today. 😔",
      sender: "user",
      timestamp: new Date(Date.now() - 3600000),
      reactions: ["❤️"]
    },
    {
      id: "msg2",
      content: "I'm sorry to hear that. Would you like to talk about what's bothering you? 🤗",
      sender: "ai",
      timestamp: new Date(Date.now() - 3540000),
      reactions: ["👍"]
    },
    {
      id: "msg3",
      isAudio: true,
      content: "Audio message",
      audioUrl: "https://example.com/audio/demo.mp3", // This would be a real URL in production
      audioDuration: 12,
      sender: "user",
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: "msg4",
      content: "I heard your message. Thank you for sharing your feelings. Is there anything specific you'd like to talk about?",
      sender: "ai",
      timestamp: new Date(Date.now() - 3300000),
    }
  ];
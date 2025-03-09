import { FC, useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatDetailProps {}

const ChatDetail: FC<ChatDetailProps> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatTitle, setChatTitle] = useState("Chat");

  // Get chat title from location state (passed during navigation)
  useEffect(() => {
    if (location.state && location.state.title) {
      setChatTitle(location.state.title);
    }
    
    // In a real app, you would fetch the chat messages based on chatId
    // This is just a mock example
    const mockMessages: Message[] = [
      {
        id: "msg1",
        content: "Hi there, I'm feeling really down today.",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: "msg2",
        content: "I'm sorry to hear that. Would you like to talk about what's bothering you?",
        sender: "ai",
        timestamp: new Date(Date.now() - 3540000)
      },
      {
        id: "msg3",
        content: "It's just been a rough day. I can't seem to focus on anything.",
        sender: "user",
        timestamp: new Date(Date.now() - 3500000)
      }
    ];
    
    setMessages(mockMessages);
  }, [chatId, location.state]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: newMessage,
        sender: "user",
        timestamp: new Date()
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage("");
      
      // Simulate AI response (in a real app, this would be an API call)
      setTimeout(() => {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: "I understand how you feel. Let's talk more about what's on your mind.",
          sender: "ai",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0d0f18] via-[#240046] to-[#240046]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] p-6 flex items-center shadow-md">
        <Link to="/" className="text-white mr-4 hover:text-gray-300">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-white text-2xl font-bold">{chatTitle}</h1>
      </div>

      {/* Chat messages */}
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`max-w-3/4 ${
                message.sender === "user" 
                  ? "ml-auto bg-gradient-to-r from-[#5a075f] to-[#7c2a8f] text-white" 
                  : "mr-auto bg-gradient-to-r from-[#2e2f3c] to-[#2a2c3e] text-white"
              } p-4 rounded-lg shadow-md`}
            >
              <p className="text-white">{message.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-gradient-to-b from-[#212529] to-[#343a40] shadow-inner">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c77dff] bg-[#1a1b26] text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="ml-2 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] p-3 rounded-lg text-white hover:from-[#d90429] hover:to-[#560bad] transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
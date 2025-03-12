import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

// Define message type
interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
}

const Chat = () => {
  // States
  const [showTitlePrompt, setShowTitlePrompt] = useState(true);
  const [chatTitle, setChatTitle] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Start chat with initial bot message after title is set
  useEffect(() => {
    if (chatTitle && !showTitlePrompt && messages.length === 0) {
      setMessages([
        { 
          sender: "bot", 
          text: `Hello! How can I assist you with "${chatTitle}" today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [chatTitle, showTitlePrompt, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!showTitlePrompt) {
      scrollToBottom();
    }
  }, [showTitlePrompt]);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle chat title submission
  const handleTitleSubmit = () => {
    if (!titleInput.trim()) return;
    setChatTitle(titleInput);
    setShowTitlePrompt(false);
  };

  // Function to determine message width class based on content length
  const getMessageWidthClass = (text: string) => {
    const length = text.length;
    
    if (length < 20) {
      return "max-w-xs"; // Small messages
    } else if (length < 80) {
      return "max-w-sm"; // Medium messages
    } else if (length < 160) {
      return "max-w-md"; // Large messages
    } else {
      return "max-w-lg"; // Very large messages
    }
  };

  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      sender: "user", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");

    // Scroll to bottom immediately after user sends message
    setTimeout(scrollToBottom, 100);

    // Simulated bot response with delay
    setTimeout(() => {
      setMessages((prev: Message[]) => [
        ...prev,
        { 
          sender: "bot", 
          text: "I'm here to help! Tell me more about what's on your mind.",
          timestamp: new Date()
        },
      ]);
      
      // Ensure scroll to bottom after bot response
      setTimeout(scrollToBottom, 100);
    }, 1000);
  };

  // Title prompt screen
  if (showTitlePrompt) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0d0f18] via-[#240046] to-[#240046]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] text-white p-4 text-center text-lg font-bold shadow-md">
          New Chat
        </div>

        {/* Title Input Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-gradient-to-r from-[#1a1b26] to-[#24243e] p-6 rounded-xl shadow-xl"
          >
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              What would you like to chat about?
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c77dff] bg-[#2c2e3e] text-white placeholder-gray-400"
                placeholder="Enter chat title..."
                aria-label="Chat title"
              />
            </div>
            <button
              onClick={handleTitleSubmit}
              disabled={!titleInput.trim()}
              className="w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white p-3 rounded-lg shadow-md hover:from-[#d90429] hover:to-[#560bad] transition-all disabled:opacity-50"
            >
              Start Chat
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0d0f18] via-[#240046] to-[#240046]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] p-6 flex items-center shadow-md">
        <button 
          onClick={() => setShowTitlePrompt(true)} 
          className="text-white mr-4 hover:text-gray-300"
          aria-label="Back to title"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-white text-2xl font-bold">{chatTitle}</h1>
      </div>

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow p-6 overflow-y-auto"
      >
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${getMessageWidthClass(msg.text)} ${
                msg.sender === "user" 
                  ? "ml-auto bg-gradient-to-r from-[#5a075f] to-[#7c2a8f] text-white" 
                  : "mr-auto bg-gradient-to-r from-[#2e2f3c] to-[#2a2c3e] text-white"
              } p-4 rounded-lg shadow-md break-words`}
            >
              <p className="text-white">{msg.text}</p>
              {msg.timestamp && (
                <p className="text-xs text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-gradient-to-b from-[#212529] to-[#343a40] shadow-inner">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c77dff] bg-[#1a1b26] text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="ml-2 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] p-3 rounded-lg text-white hover:from-[#d90429] hover:to-[#560bad] transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
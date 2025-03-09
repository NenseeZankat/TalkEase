import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

// Define message type
interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chat = () => {
  // States
  const [showTitlePrompt, setShowTitlePrompt] = useState(true);
  const [chatTitle, setChatTitle] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Start chat with initial bot message after title is set
  useEffect(() => {
    if (chatTitle && !showTitlePrompt && messages.length === 0) {
      setMessages([
        { sender: "bot", text: `Hello! How can I assist you with "${chatTitle}" today?` }
      ]);
    }
  }, [chatTitle, showTitlePrompt, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle chat title submission
  const handleTitleSubmit = () => {
    if (!titleInput.trim()) return;
    setChatTitle(titleInput);
    setShowTitlePrompt(false);
  };

  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");

    // Simulated bot response with delay
    setTimeout(() => {
      setMessages((prev: Message[]) => [
        ...prev,
        { sender: "bot", text: "I'm here to help! Tell me more about what's on your mind." },
      ]);
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
      <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] text-white p-4 flex items-center shadow-md">
        <button 
          onClick={() => setShowTitlePrompt(true)} 
          className="text-white mr-4 hover:text-gray-300"
          aria-label="Back to title"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center mr-8">{chatTitle}</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg max-w-xs shadow-md ${
              msg.sender === "user"
                ? "ml-auto bg-gradient-to-r from-[#5a075f] to-[#7c2a8f]  text-white"
                : "bg-gradient-to-r from-[#2e2f3c] to-[#2a2c3e] text-white"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 flex bg-gradient-to-b from-[#212529] to-[#343a40] shadow-inner">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c77dff] bg-[#1a1b26] text-white placeholder-gray-400"
          placeholder="Type a message..."
          aria-label="Chat input"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white px-4 py-3 rounded-lg shadow-md hover:from-[#d90429] hover:to-[#560bad]"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
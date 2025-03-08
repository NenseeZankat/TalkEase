import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Chat = () => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulated bot response with delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm here to help! Tell me more about what’s on your mind." },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0d0f18] via-[#240046] to-[#240046]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] text-white p-4 text-center text-lg font-bold shadow-md">
        Chat with AI
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
                ? "ml-auto bg-gradient-to-r from-[#7c2a8f] to-[#5a075f] text-white"
                : "bg-gradient-to-r from-[#5a075f] to-[#7c2a8f] text-white"
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

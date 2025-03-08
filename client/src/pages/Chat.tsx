import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I assist you today?" }]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0d0f18] via-[#240046] to-[#240046]">
      <div className="bg-gradient-to-r from-[#240046] to-[#5a189a] text-white p-4 text-center text-lg font-bold shadow-md">
        Chat with AI
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs shadow-md ${
              msg.sender === "user"
                ? "ml-auto bg-gradient-to-r from-[#7c2a8f] to-[#5a075f] text-white"
                : "bg-gradient-to-r from-[#5a075f] to-[#7c2a8f] text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex bg-gradient-to-b from-[#212529] to-[#343a40] shadow-inner">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c77dff] bg-[#1a1b26] text-white placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white px-4 py-3 rounded-lg shadow-md hover:from-[#d90429] hover:to-[#560bad]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

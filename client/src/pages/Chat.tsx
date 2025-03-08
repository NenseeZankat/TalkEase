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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-green-500 text-white p-4 text-center text-lg font-semibold">
        Chat with AI
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg max-w-xs ${msg.sender === "user" ? "ml-auto bg-blue-500 text-white" : "bg-gray-200"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 bg-green-500 text-white px-4 py-3 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

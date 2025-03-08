import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";

const ChatInterface: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const navigate = useNavigate();

  const handleNewChat = () => {
    if (newChatTitle.trim()) {
      console.log("New Chat Created:", newChatTitle);
      setNewChatTitle("");
      setIsModalOpen(false);
      navigate("/chat");
    }
  };

  return (
    <div className="flex h-screen bg-[#0d0f18] text-white transition-all rounded-xl shadow-2xl">
      <div className="flex flex-col flex-grow transition-all duration-300">
        <div className="bg-gradient-to-b from-[#240046] to-[#5a189a] p-16 rounded-b-3xl shadow-lg text-center">
          <h1 className="text-white text-3xl font-bold">Chat Conversations</h1>
          <p className="text-gray-400 text-sm mt-1">1571 Total &bull; 32 Left this Month</p>
        </div>

        <div className="flex flex-col flex-grow p-8 space-y-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-[#c77dff] pb-2">Recent (4)</h2>
          <div className="space-y-4">
            {["Recent Breakup, felt sad", "Shitty Teacher at Uni", "Just wanna stop existing"].map((title, index) => (
              <div key={index} className="flex items-center p-5 bg-[#1a1b26] rounded-xl shadow-md hover:bg-[#2c2e3e] transition-all border border-gray-700 hover:border-[#c77dff] ring-1 ring-transparent hover:ring-[#c77dff]">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-white">{title}</p>
                  <p className="text-sm text-gray-400">478 Total &bull; Emotion</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-[#c77dff] pb-2">Past (16)</h2>
          <div className="space-y-4">
            {["More about this Xmas", "I miss my best friend", "Failed my exam again"].map((title, index) => (
              <div key={index} className="flex items-center p-5 bg-[#1a1b26] rounded-xl shadow-md hover:bg-[#2c2e3e] transition-all border border-gray-700 hover:border-[#c77dff] ring-1 ring-transparent hover:ring-[#c77dff]">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-white">{title}</p>
                  <p className="text-sm text-gray-400">478 Total &bull; Emotion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] p-5 rounded-full shadow-lg hover:from-[#d90429] hover:to-[#560bad] transition-all cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="text-white text-2xl" />
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-[#161b22] p-6 rounded-lg shadow-lg w-96 border border-gray-700 ring-1 ring-transparent ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Start a New Chat</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <FaTimes className="text-gray-400 hover:text-gray-200" />
                </button>
              </div>
              <input
                type="text"
                className="w-full p-2 border border-gray-700 hover:border-[#c77dff] ring-1 ring-transparent hover:ring-[#c77dff] rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:border-[#c77dff]"
                placeholder="Enter chat title..."
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
              />
              <button
                className="mt-4 w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white py-2 rounded-lg hover:from-[#d90429] hover:to-[#560bad] transition-all"
                onClick={handleNewChat}
              >
                Start Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
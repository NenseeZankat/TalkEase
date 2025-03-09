import { FC, useState } from "react";
import { FaTimes } from "react-icons/fa";

const NewChatModal: FC<{ isOpen: boolean; onClose: () => void; onStartChat: (title: string) => void }> = ({ isOpen, onClose, onStartChat }) => {
  const [newChatTitle, setNewChatTitle] = useState("");

  const handleNewChat = () => {
    if (newChatTitle.trim()) {
      onStartChat(newChatTitle);
      setNewChatTitle("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-[#161b22] p-6 rounded-lg shadow-lg w-96 border border-gray-700 ring-1 ring-transparent ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Start a New Chat</h2>
          <button onClick={onClose}>
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
  );
};

export default NewChatModal;
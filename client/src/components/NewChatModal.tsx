import { FC, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "../layout/ThemeProvider"; // Make sure the path is correct

const NewChatModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (title: string) => void;
}> = ({ isOpen, onClose, onStartChat }) => {
  const { themeStyles } = useTheme();
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
    <div className={`fixed inset-0 flex items-center justify-center ${themeStyles.modalBg}`}>
      <div className={`p-6 rounded-lg shadow-lg w-96 border border-gray-700 ring-1 ring-transparent ${themeStyles.card}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Start a New Chat</h2>
          <button onClick={onClose} className={themeStyles.hoverEffect}>
            <FaTimes className="text-gray-400 hover:text-gray-200" />
          </button>
        </div>
        <input
          type="text"
          className={`w-full p-2 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring focus:border-opacity-100 ${themeStyles.inputField} ${themeStyles.hoverEffect}`}
          placeholder="Enter chat title..."
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
        />
        <button
          className={`mt-4 w-full text-white py-2 rounded-lg transition-all ${themeStyles.button}`}
          onClick={handleNewChat}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default NewChatModal;
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";

interface Chat {
  id: string;
  title: string;
  messageCount: number;
  category: string;
}

const ChatInterface: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const navigate = useNavigate();

  // Sample chat data with unique IDs
  const recentChats: Chat[] = [
    { id: "chat1", title: "Recent Breakup, felt sad", messageCount: 478, category: "Emotion" },
    { id: "chat2", title: "Shitty Teacher at Uni", messageCount: 356, category: "Emotion" },
    { id: "chat3", title: "Just wanna stop existing", messageCount: 287, category: "Emotion" }
  ];

  const pastChats: Chat[] = [
    { id: "chat4", title: "More about this Xmas", messageCount: 423, category: "Emotion" },
    { id: "chat5", title: "I miss my best friend", messageCount: 312, category: "Emotion" },
    { id: "chat6", title: "Failed my exam again", messageCount: 189, category: "Emotion" }
  ];

  const handleNewChat = () => {
    if (newChatTitle.trim()) {
      // In a real app, you'd generate a unique ID and save the chat
      const newChatId = `new-${Date.now()}`;
      console.log("New Chat Created:", newChatTitle, "ID:", newChatId);
      setNewChatTitle("");
      setIsModalOpen(false);
      
      // Navigate to the new chat with its ID
      navigate(`/chat/${newChatId}`, { 
        state: { title: newChatTitle } 
      });
    }
  };

  const handleChatClick = (chatId: string, chatTitle: string) => {
    // Navigate to the selected chat with its ID
    navigate(`/chat/${chatId}`, {
      state: { title: chatTitle }
    });
  };

  // Chat item component for reuse
  const ChatItem = ({ chat }: { chat: Chat }) => (
    <div 
      className="flex items-center p-5 bg-[#1a1b26] rounded-xl shadow-md hover:bg-[#2c2e3e] transition-all border border-gray-700 hover:border-[#c77dff] ring-1 ring-transparent hover:ring-[#c77dff] cursor-pointer"
      onClick={() => handleChatClick(chat.id, chat.title)}
    >
      <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
      <div>
        <p className="font-medium text-white">{chat.title}</p>
        <p className="text-sm text-gray-400">{chat.messageCount} Total &bull; {chat.category}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0d0f18] text-white transition-all rounded-xl shadow-2xl">
      {/* Main content */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="bg-gradient-to-b from-[#240046] to-[#5a189a] p-16 rounded-b-3xl shadow-lg text-center">
          <h1 className="text-white text-3xl font-bold">Chat Conversations</h1>
          <p className="text-gray-400 text-sm mt-1">1571 Total &bull; 32 Left this Month</p>
        </div>

        <div className="flex flex-col flex-grow p-8 space-y-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-[#c77dff] pb-2">Recent ({recentChats.length})</h2>
          <div className="space-y-4">
            {recentChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>

          <h2 className="text-lg font-semibold text-[#c77dff] pb-2">Past ({pastChats.length})</h2>
          <div className="space-y-4">
            {pastChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        </div>

        <button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] p-5 rounded-full shadow-lg hover:from-[#d90429] hover:to-[#560bad] transition-all cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="text-white text-2xl" />
        </button>
      </div>

      {/* Modal for new chat - with transparent background */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto bg-[#1a1b26] rounded-xl p-6 w-96 z-10 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#c77dff]">Create New Chat</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Chat Title
              </label>
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Enter a title for your chat"
                className="w-full p-3 bg-[#2c2e3e] rounded-lg border border-gray-700 focus:border-[#c77dff] focus:outline-none focus:ring-1 focus:ring-[#c77dff] text-white"
              />
            </div>
            
            <button
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] py-3 rounded-lg font-medium text-white hover:from-[#d90429] hover:to-[#560bad] transition-all"
              disabled={!newChatTitle.trim()}
            >
              Start New Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
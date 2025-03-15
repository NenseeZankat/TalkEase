// src/components/chat/ChatHeader.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaHeadphones } from "react-icons/fa";

interface ChatHeaderProps {
  chatTitle: string;
  toggleAudioOptions: () => void;
  toggleOptions: () => void;
  themeStyles: any;
}

const ChatHeader: FC<ChatHeaderProps> = ({ 
  chatTitle, 
  toggleAudioOptions, 
  toggleOptions, 
  themeStyles 
}) => {
  return (
    <div className={`${themeStyles.header} p-4 flex items-center shadow-xl rounded-b-2xl backdrop-blur-sm z-10 transition-colors duration-500`}>
      <Link to="/" className="text-white mr-4 p-2 hover:bg-white/10 rounded-full transition-all duration-300">
        <FaArrowLeft className="text-xl" />
      </Link>
      <div className="flex flex-col">
        <h1 className="text-white text-xl font-bold">{chatTitle}</h1>
        <span className="text-xs text-purple-300">Active now</span>
      </div>
      <div className="ml-auto flex space-x-2 items-center">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-xs text-green-300">AI is online</span>
        
        {/* Audio options toggle button */}
        <button 
          className="p-2 text-white/70 hover:text-white/100 hover:bg-white/10 rounded-full ml-2 transition-all duration-300 audio-options-toggle-button"
          onClick={toggleAudioOptions}
        >
          <FaHeadphones />
        </button>
        
        <button 
          className="p-2 text-white/70 hover:text-white/100 hover:bg-white/10 rounded-full ml-2 transition-all duration-300 options-toggle-button"
          onClick={toggleOptions}
        >
          <FaEllipsisV />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
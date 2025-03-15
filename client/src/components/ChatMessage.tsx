// src/components/chat/ChatMessage.tsx
import { FC } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { Message } from "../models/Message";

interface ChatMessageProps {
  message: Message;
  isPlaying: boolean;
  onPlayAudio: (audioUrl: string, messageId: string) => void;
  onStopAudio: (audioUrl: string, messageId: string) => void;
  onAddReaction: (messageId: string, reaction: string) => void;
  themeStyles: any;
}

const ChatMessage: FC<ChatMessageProps> = ({
  message,
  isPlaying,
  onPlayAudio,
  onStopAudio,
  onAddReaction,
  themeStyles
}) => {
  // Function to determine message width based on content length
  const getMessageWidth = (content: string) => {
    const length = content.length;
    
    if (length < 20) return "w-auto max-w-xs"; // Short messages
    if (length < 100) return "w-auto max-w-sm"; // Medium messages
    if (length < 200) return "w-auto max-w-md"; // Longer messages
    return "w-auto max-w-lg"; // Very long messages
  };

  // Format time for audio display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Generate a waveform visualization for audio messages
  const generateWaveform = (playing: boolean) => {
    return (
      <div className="flex items-center justify-center space-x-0.5">
        {Array(20).fill(0).map((_, i) => {
          const height = Math.abs(Math.sin((i + 1) * 0.5) * 16) + 4;
          return (
            <div 
              key={i}
              className={`w-1 rounded-full ${playing ? 'animate-pulse' : ''}`}
              style={{ 
                height: `${height}px`, 
                backgroundColor: playing ? 'rgba(167, 139, 250, 0.8)' : 'rgba(167, 139, 250, 0.4)'
              }}
            ></div>
          );
        })}
      </div>
    );
  };

  // Render time badge with relative time format
  const renderTimeBadge = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`flex items-end ${message.sender === "user" ? "justify-end" : "justify-start"} ${
        message.isNew ? "animate-fadeIn" : ""
      }`}
    >
      {message.sender === "ai" && (
        <div className={`w-8 h-8 rounded-full ${themeStyles.aiAvatar} flex items-center justify-center mr-2 mb-1 shadow-lg`}>
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      )}
      
      <div className="group flex flex-col">
        <div
          className={`${message.isAudio ? "w-64" : getMessageWidth(message.content)} ${
            message.sender === "user" 
              ? `${themeStyles.userMessage} text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl` 
              : `${themeStyles.aiMessage} text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl`
          } p-4 shadow-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl border border-white/10`}
        >
          {/* Audio message content */}
          {message.isAudio ? (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => isPlaying 
                    ? onStopAudio(message.audioUrl!, message.id) 
                    : onPlayAudio(message.audioUrl!, message.id)
                  }
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isPlaying 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-purple-600 hover:bg-purple-700"
                  } transition-colors`}
                >
                  {isPlaying 
                    ? <FaStop className="text-white text-sm" /> 
                    : <FaPlay className="text-white text-sm ml-0.5" />
                  }
                </button>

                {/* Waveform visualization */}
                <div className="flex-grow">
                  {generateWaveform(isPlaying)}
                  
                  {/* Duration display */}
                  <div className="text-xs text-white/70 mt-1">
                    {formatTime(message.audioDuration || 0)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Regular text message
            message.content
          )}
        </div>
        
        {/* Message timestamp and reactions */}
        <div className="flex items-center mt-1 space-x-1">
          <span className="text-xs text-purple-300 opacity-70">
            {renderTimeBadge(message.timestamp)}
          </span>
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex items-center bg-white/10 rounded-full px-2 py-0.5">
              {message.reactions.map((reaction) => (
                <span key={reaction} className="text-xs">
                  {reaction}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {message.sender === "user" && (
        <div className={`w-8 h-8 rounded-full ${themeStyles.userAvatar} flex items-center justify-center ml-2 mb-1 shadow-lg`}>
          <span className="text-white text-xs font-bold">You</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
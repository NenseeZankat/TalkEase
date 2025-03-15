// src/components/chat/MessageList.tsx
import { FC, RefObject } from "react";
import { Message } from "../models/Message";
import ChatMessage from "./ChatMessage";
import DateDivider from "./DateDivider";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isPlaying: Record<string, boolean>;
  handlePlayAudio: (audioUrl: string, messageId: string) => void;
  handleStopAudio: (audioUrl: string, messageId: string) => void;
  handleAddReaction: (messageId: string, reaction: string) => void;
  themeStyles: any;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const MessageList: FC<MessageListProps> = ({
  messages,
  isTyping,
  isPlaying,
  handlePlayAudio,
  handleStopAudio,
  handleAddReaction,
  themeStyles,
  messagesEndRef
}) => {
  // Function to check if we should show a date divider
  const shouldShowDateDivider = (currentIndex: number): boolean => {
    if (currentIndex === 0) return true;
    if (currentIndex === 2) return true; // For demonstration purposes
    
    // In a real app, you would compare actual dates
    return false;
  };

  // Function to get divider text
  const getDividerText = (index: number): string => {
    return index === 0 ? "Today" : "Yesterday";
  };

  return (
    <div className="flex-grow p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent transition-colors duration-500">
      <div className="space-y-6 py-2">
        {messages.map((message, index) => (
          <div key={message.id}>
            {shouldShowDateDivider(index) && (
              <DateDivider text={getDividerText(index)} themeStyles={themeStyles} />
            )}
            
            <ChatMessage
              message={message}
              isPlaying={isPlaying[message.id] || false}
              onPlayAudio={handlePlayAudio}
              onStopAudio={handleStopAudio}
              onAddReaction={handleAddReaction}
              themeStyles={themeStyles}
            />
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className={`w-8 h-8 rounded-full ${themeStyles.aiAvatar} flex items-center justify-center mr-2 shadow-lg`}>
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className={`${themeStyles.aiMessage} rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-3 shadow-lg`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
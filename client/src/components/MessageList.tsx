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
    
    // Compare current message date with previous message date
    if (currentIndex > 0) {
      const currentDate = new Date(messages[currentIndex].timestamp);
      const prevDate = new Date(messages[currentIndex - 1].timestamp);
      
      return !isSameDay(currentDate, prevDate);
    }
    
    return false;
  };
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDividerText = (index: number): string => {
    const messageDate = new Date(messages[index].timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (isSameDay(messageDate, today)) {
      return "Today";
    } else if (isSameDay(messageDate, yesterday)) {
      return "Yesterday";
    } else {
      // Format the date as needed, e.g., "Mar 20, 2025"
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
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
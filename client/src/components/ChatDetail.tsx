import { FC, useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  FaArrowLeft, FaPaperPlane, FaSmile, FaTimes, FaEllipsisV, FaStar
} from "react-icons/fa";
import { useTheme } from "../layout/ThemeProvider";
import axios from "axios";

// Emoji data - in a real app you'd use a library or API
const emojiCategories = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"]
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👋", "🤚", "🖐️", "✋", "🖖"]
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"]
  },
  {
    name: "Objects",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🎁"]
  }
];

// Quick response suggestions
// const quickResponses = [
//   "Thanks for your help! 👍",
//   "I'll think about it 🤔",
//   "Can you explain more? 🧐",
//   "That's exactly what I needed! ✨"
// ];

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  reactions?: string[];
  isNew?: boolean;
}

interface ChatDetailProps {
  chatId: string;

}
const ChatDetail: FC<ChatDetailProps> = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatTitle, setChatTitle] = useState("Chat");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  // User ID - in a real app, this would come from authentication
  const userId = "67d053a0b18cab97965e65d0";  
  // Use the theme context instead of local state
  const { theme, setTheme, themeStyles } = useTheme();

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle clicks outside menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.emoji-toggle-button')) {
        setShowEmojiPicker(false);
      }
      
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.options-toggle-button')) {
        setShowOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef, optionsRef]);

  // Fetch chat history on component mount
  useEffect(() => {
    if (location.state && location.state.title) {
      setChatTitle(location.state.title);
    }
    
    // In a real app, you would fetch the chat history based on chatId and userId
    // This is just to initialize with some mock data
    const mockMessages: Message[] = [
      {
        id: "msg1",
        content: "Hi there, I'm feeling really down today. 😔",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000),
        reactions: ["❤️"]
      },
      {
        id: "msg2",
        content: "I'm sorry to hear that. Would you like to talk about what's bothering you? 🤗",
        sender: "ai",
        timestamp: new Date(Date.now() - 3540000),
        reactions: ["👍"]
      }
    ];
    
    setMessages(mockMessages);
    
    // Fetch chat history from API - commented out for now
     fetchChatHistory("1", userId);
    
    // Focus input on load
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [chatId, location.state]);

  // Fetch chat history from API
  const fetchChatHistory = async (chatId: string, userId: string) => {
    try {
      // Replace with your actual endpoint
      const response = await axios.get(`http://localhost:5000/api/chat//history/${userId}`, {
        params: { chatId, userId }
      });
      
      if (response.data && response.data.history) {
        const formattedMessages = response.data.history.map((item: any) => ({
          id: item._id || `hist-${Math.random().toString(36).substring(2, 9)}`,
          content: item.userMessage,
          sender: "user",
          timestamp: new Date(item.timestamp || Date.now()),
          reactions: []
        })).concat(response.data.history.map((item: any) => ({
          id: `ai-${item._id || Math.random().toString(36).substring(2, 9)}`,
          content: item.botResponse,
          sender: "ai",
          timestamp: new Date((item.timestamp || Date.now()) + 1000), // Add 1 second to ensure proper ordering
          reactions: []
        })));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // Fallback to mock messages if API fails
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to determine message width based on content length
  const getMessageWidth = (content: string) => {
    const length = content.length;
    
    if (length < 20) return "w-auto max-w-xs"; // Short messages
    if (length < 100) return "w-auto max-w-sm"; // Medium messages
    if (length < 200) return "w-auto max-w-md"; // Longer messages
    return "w-auto max-w-lg"; // Very long messages
  };

  // Send a new message via API
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Add user message to UI immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: newMessage,
        sender: "user",
        timestamp: new Date(),
        isNew: true
      };
      
      setMessages([...messages, userMessage]);
      const userMessageContent = newMessage;
      setNewMessage("");
      setShowEmojiPicker(false);
      setShowQuickResponses(false);
      
      // Show typing indicator
      setIsTyping(true);
      try {
        // Send message to API
        const response = await axios.post("http://localhost:8000/chat/", {
          userId: userId,
          userMessage: userMessageContent
        });
        
        // Handle the response
        if (response.data && response.data.botResponse) {
          setIsTyping(false);
          
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            content: response.data.botResponse,
            sender: "ai",
            timestamp: new Date(),
            isNew: true
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error sending message to API:", error);
        setIsTyping(false);
        
        // Fallback response in case of API error
        const errorMessage: Message = {
          id: `ai-${Date.now()}`,
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
          isNew: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  // Handle quick response selection
  const handleQuickResponse = (response: string) => {
    setNewMessage(response);
    setShowQuickResponses(false);
    inputRef.current?.focus();
  };

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    setShowQuickResponses(false);
  };

  // Toggle quick responses
  const toggleQuickResponses = () => {
    setShowQuickResponses(prev => !prev);
    setShowEmojiPicker(false);
  };

  // Toggle options menu
  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  // Add reaction to message
  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { 
              ...message, 
              reactions: message.reactions 
                ? message.reactions.includes(reaction)
                  ? message.reactions.filter(r => r !== reaction) // Remove if already exists
                  : [...message.reactions, reaction] // Add if doesn't exist
                : [reaction] // Create new array if none exists
            }
          : message
      )
    );
  };

  // Change theme using the context
  const changeTheme = (newTheme: "purple" | "cosmic" | "night") => {
    setTheme(newTheme);
    setShowOptions(false);
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
    <div className={`flex flex-col h-screen ${themeStyles.background} transition-colors duration-500`}>
      {/* Header */}
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
          <button 
            className="p-2 text-white/70 hover:text-white/100 hover:bg-white/10 rounded-full ml-2 transition-all duration-300 options-toggle-button"
            onClick={toggleOptions}
          >
            <FaEllipsisV />
          </button>
          
          {/* Options Menu */}
          {showOptions && (
            <div 
              ref={optionsRef}
              className="absolute top-16 right-4 w-48 bg-black/70 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden z-20"
            >
              <div className="p-2">
                <h4 className="text-xs text-white/60 px-2 py-1">Theme</h4>
                <button 
                  onClick={() => changeTheme("purple")}
                  className={`w-full text-left text-sm p-2 rounded hover:bg-white/10 transition-colors ${theme === "purple" ? "text-white bg-white/10" : "text-white/80"}`}
                >
                  🟣 Purple Dream
                </button>
                <button 
                  onClick={() => changeTheme("cosmic")}
                  className={`w-full text-left text-sm p-2 rounded hover:bg-white/10 transition-colors ${theme === "cosmic" ? "text-white bg-white/10" : "text-white/80"}`}
                >
                  ✨ Cosmic Vibes
                </button>
                <button 
                  onClick={() => changeTheme("night")}
                  className={`w-full text-left text-sm p-2 rounded hover:bg-white/10 transition-colors ${theme === "night" ? "text-white bg-white/10" : "text-white/80"}`}
                >
                  🌃 Night Mode
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-grow p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent transition-colors duration-500">
        <div className="space-y-6 py-2">
          {/* Date divider */}
          <div className="flex justify-center">
            <div className={`${themeStyles.divider} text-purple-200 text-xs px-3 py-1 rounded-full shadow-lg`}>
              Today
            </div>
          </div>
          
          {messages.map((message, index) => {
            // Show day divider when needed (in a real app, you'd compare actual dates)
            const showDivider = index === 2;
            
            return (
              <div key={message.id}>
                {showDivider && (
                  <div className="flex justify-center my-6">
                    <div className={`${themeStyles.divider} text-purple-200 text-xs px-3 py-1 rounded-full shadow-lg`}>
                      Yesterday
                    </div>
                  </div>
                )}
                
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
                      className={`${getMessageWidth(message.content)} ${
                        message.sender === "user" 
                          ? `${themeStyles.userMessage} text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl` 
                          : `${themeStyles.aiMessage} text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl`
                      } p-4 shadow-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl border border-white/10`}
                    >
                      <p className="text-white text-sm md:text-base break-words leading-relaxed">{message.content}</p>
                      <p className="text-xs text-right text-purple-200 mt-1 opacity-80">
                        {renderTimeBadge(message.timestamp)}
                      </p>
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex mt-1 space-x-1 ml-2">
                        {message.reactions.map((reaction, i) => (
                          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-full px-1 py-0.5 text-xs shadow-md">
                            {reaction}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reaction buttons */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex mt-1 ${message.sender === "user" ? "self-end mr-1" : "self-start ml-1"}`}>
                      <button onClick={() => addReaction(message.id, "👍")} className="text-xs p-1 hover:bg-white/10 rounded transition-colors">
                        👍
                      </button>
                      <button onClick={() => addReaction(message.id, "❤️")} className="text-xs p-1 hover:bg-white/10 rounded transition-colors">
                        ❤️
                      </button>
                      <button onClick={() => addReaction(message.id, "😂")} className="text-xs p-1 hover:bg-white/10 rounded transition-colors">
                        😂
                      </button>
                    </div>
                  </div>
                  
                  {message.sender === "user" && (
                    <div className={`w-8 h-8 rounded-full ${themeStyles.userAvatar} flex items-center justify-center ml-2 mb-1 shadow-lg`}>
                      <span className="text-purple-900 text-xs font-bold">You</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end animate-fadeIn">
              <div className={`w-8 h-8 rounded-full ${themeStyles.aiAvatar} flex items-center justify-center mr-2 mb-1 shadow-lg`}>
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div className={`${themeStyles.aiMessage} text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-4 shadow-lg backdrop-blur-sm`}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty div for scroll reference */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick response suggestions */}
      {showQuickResponses && (
        <div className="px-4 pb-2 space-y-2">
          <p className="text-xs text-purple-300 ml-2">Quick responses:</p>
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className={`${themeStyles.aiMessage} px-3 py-2 rounded-full text-xs text-white/90 hover:text-white transition-all hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm border border-white/10`}
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className={`p-4 ${themeStyles.inputArea} shadow-inner border-t border-white/10 relative transition-colors duration-500`}>
        {/* Input toolbar */}
        <div className="flex justify-between items-center mb-2 px-2">
          <button 
            className="p-1.5 text-purple-300/70 hover:text-purple-300/100 hover:bg-white/5 rounded-full transition-all"
            onClick={toggleQuickResponses}
          >
            <FaStar className={`text-sm ${showQuickResponses ? 'text-yellow-400' : ''}`} />
          </button>
        </div>
        
        {/* Input field */}
        <div className={`flex items-center ${themeStyles.inputField} rounded-full shadow-lg backdrop-blur-sm border border-white/10`}>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="  Type a message..."
            className="flex-1 p-3 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          
          <button 
            className="p-3 text-purple-300/70 hover:text-purple-300/100 emoji-toggle-button transition-colors"
            onClick={toggleEmojiPicker}
          >
            <FaSmile className={`text-lg ${showEmojiPicker ? 'text-purple-100' : ''}`} />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`ml-1 mr-1 ${themeStyles.button} p-3 rounded-full text-white transition-all disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl`}
          >
            <FaPaperPlane />
          </button>
        </div>
        
        <div className="mt-2 text-center text-xs text-purple-300/70">
          <span>AI Assistant is ready to help • Message is encrypted</span>
        </div>
        
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-24 right-6 w-64 md:w-80 bg-black/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden z-10 animate-fadeIn"
          >
            <div className={`flex justify-between items-center ${themeStyles.header} px-4 py-2`}>
              <span className="text-white text-sm font-medium">Emoji</span>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Category tabs */}
            <div className="flex border-b border-white/10">
              {emojiCategories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(index)}
                  className={`px-3 py-2 text-xs flex-1 transition-colors ${
                    activeCategory === index 
                      ? `${themeStyles.divider} text-white` 
                      : 'text-purple-300 hover:bg-white/10'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* Emoji grid */}
            <div className="p-2 h-48 overflow-y-auto">
              <div className="grid grid-cols-7 gap-1">
                {emojiCategories[activeCategory].emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white/10 rounded transition-colors transform hover:scale-125 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recently used - static for demo */}
            <div className="p-2 border-t border-white/10">
              <p className="text-xs text-purple-300 mb-1">Recently Used</p>
              <div className="flex space-x-1">
                {["😊", "👍", "❤️", "😂", "🙏"].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="w-6 h-6 flex items-center justify-center text-lg hover:bg-white/10 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
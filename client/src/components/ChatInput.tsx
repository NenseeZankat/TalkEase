import { FC, useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useTheme } from "../layout/ThemeProvider";
import axios from "axios";
import { Message } from "../models/Message";
import { ChatDetailProps } from "../models/ChatDetailProps";
import { mockMessages } from "../dummydata/mockMessages";

// Import Firebase and Storage
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Import components
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import AudioOptionsMenu from "./menus/AudioOptionsMenu";
import ThemeOptionsMenu from "./menus/ThemeOptionsMenu";

const ChatDetail: FC<ChatDetailProps> = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatTitle, setChatTitle] = useState("Chat");
  const [isTyping, setIsTyping] = useState(false);
  const [showAudioOptions, setShowAudioOptions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Audio states
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(80);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const audioOptionsRef = useRef<HTMLDivElement>(null);
  const audioPlayerRefs = useRef<Record<string, HTMLAudioElement>>({});
  
  // User ID - in a real app, this would come from authentication
  const userId = "67d053a0b18cab97965e65d0";
  const chatId="1";
  
  // Firebase Storage
  const storage = getStorage();
  
  // Theme
  const { theme, setTheme, themeStyles } = useTheme();

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle clicks outside menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.options-toggle-button')) {
        setShowOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef, audioOptionsRef]);

  // Fetch chat history on component mount
  useEffect(() => {
    if (location.state && location.state.title) {
      setChatTitle(location.state.title);
    }
    
    setMessages(mockMessages);
    
    // Fetch chat history from API
    // fetchChatHistory(chatId, userId);
  }, [chatId, location.state]);

  // Fetch chat history from API
  const fetchChatHistory = async (chatId: string, userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/history/${userId}`, {
        params: { chatId, userId }
      });
      
      if (response.data && response.data.history) {
        const formattedMessages = response.data.history.map((item: any) => ({
          id: item._id || `hist-${Math.random().toString(36).substring(2, 9)}`,
          content: item.userMessage,
          sender: "user",
          timestamp: new Date(item.timestamp || Date.now()),
          reactions: [],
          isAudio: item.isAudio || false,
        })).concat(response.data.history.map((item: any) => ({
          id: `ai-${item._id || Math.random().toString(36).substring(2, 9)}`,
          content: item.botResponse,
          sender: "ai",
          timestamp: new Date((item.timestamp || Date.now()) + 1000), // Add 1 second to ensure proper ordering
          reactions: [],
          isAudio: item.isAudio || false,
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

  // Handle audio message submission
  const handleAudioMessage = (audioUrl: string, duration: number) => {
    const audioMessage: Message = {
      id: `user-audio-${Date.now()}`,
      content: "Audio message",
      sender: "user",
      timestamp: new Date(),
      isNew: true,
      isAudio: true,
      audioUrl: audioUrl,
      audioDuration: duration
    };
    
    setMessages(prev => [...prev, audioMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: "I've received your audio message. Is there anything specific you'd like me to help you with?",
        sender: "ai",
        timestamp: new Date(),
        isNew: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Audio playback controls
  const handlePlayAudio = async (audioUrl: string, messageId: string) => {
    // Stop any currently playing audio
    Object.values(audioPlayerRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    setIsPlaying({});
    
    // Create or get audio element
    let audio = audioPlayerRefs.current[messageId];
    if (!audio) {
      // Fetch audio from Firebase Storage
      const fileRef = ref(storage, `audioMessages/${audioUrl}`);
      try {
        const audioUrlFirebase = await getDownloadURL(fileRef);
        audio = new Audio(audioUrlFirebase);
        audioPlayerRefs.current[messageId] = audio;
        
        // Set volume based on user preference
        audio.volume = audioVolume / 100;
        
        audio.onplay = () => {
          setIsPlaying(prev => ({ ...prev, [messageId]: true }));
        };
        
        audio.onended = () => {
          setIsPlaying(prev => ({ ...prev, [messageId]: false }));
        };
        
        audio.onerror = () => {
          console.error("Error playing audio");
          setIsPlaying(prev => ({ ...prev, [messageId]: false }));
        };
        
        audio.play();
      } catch (error) {
        console.error("Error fetching audio from Firebase:", error);
      }
    }
  };

  const handleStopAudio = (messageId: string) => {
    const audio = audioPlayerRefs.current[messageId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setIsPlaying(prev => ({ ...prev, [messageId]: false }));
  };

  // Toggle audio options menu
  const toggleAudioOptions = () => {
    setShowAudioOptions(prev => !prev);
    setShowOptions(false);
  };

  // Toggle options menu
  const toggleOptions = () => {
    setShowOptions(prev => !prev);
    setShowAudioOptions(false);
  };

  // Change theme using the context
  const changeTheme = (newTheme: "purple" | "cosmic" | "night") => {
    setTheme(newTheme);
    setShowOptions(false);
  };
  
  return (
    <div className={`flex flex-col h-screen ${themeStyles.background} transition-colors duration-500`}>
      <ChatHeader 
        chatTitle={chatTitle}
        toggleAudioOptions={toggleAudioOptions}
        toggleOptions={toggleOptions}
        themeStyles={themeStyles}
      />
      
      {/* Audio Options Menu */}
      {showAudioOptions && (
        <AudioOptionsMenu
          ref={audioOptionsRef}
          audioVolume={audioVolume}
          audioFeedback={audioFeedback}
        />
      )}
      
      {/* Theme Options Menu */}
      {showOptions && (
        <ThemeOptionsMenu
          ref={optionsRef}
          currentTheme={theme}
          changeTheme={changeTheme}
        />
      )}
      
      <MessageList 
        messages={messages}
        isTyping={isTyping}
        isPlaying={isPlaying}
        handlePlayAudio={handlePlayAudio}
        handleStopAudio={handleStopAudio}
        themeStyles={themeStyles}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        onAudioMessage={handleAudioMessage}
        themeStyles={themeStyles}
      />
    </div>
  );
};

export default ChatDetail;

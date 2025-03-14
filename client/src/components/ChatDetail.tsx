import { FC, useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  FaArrowLeft, FaPaperPlane, FaSmile, FaTimes, FaEllipsisV, FaStar, 
  FaMicrophone, FaStop, FaVolumeUp, FaVolumeMute, FaHeadphones, 
  FaPlay, FaPause
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
const quickResponses = [
  "Thanks for your help! 👍",
  "I'll think about it 🤔",
  "Can you explain more? 🧐",
  "That's exactly what I needed! ✨"
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  reactions?: string[];
  isNew?: boolean;
  isAudio?: boolean;
  audioUrl?: string;
  audioDuration?: number;
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
  const [showAudioOptions, setShowAudioOptions] = useState(false);
  
  // Audio chat states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(80);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const audioOptionsRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRefs = useRef<Record<string, HTMLAudioElement>>({});
  
  // User ID - in a real app, this would come from authentication
  const userId = "67d053a0b18cab97965e65d0";  
  const userDetails = localStorage.getItem("user");
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
      if (audioOptionsRef.current && !audioOptionsRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.audio-options-toggle-button')) {
        setShowAudioOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef, optionsRef, audioOptionsRef]);

  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up audio URLs
      messages.forEach(message => {
        if (message.isAudio && message.audioUrl) {
          URL.revokeObjectURL(message.audioUrl);
        }
      });
    };
  }, [messages]);

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
      },
      {
        id: "msg3",
        isAudio: true,
        content: "Audio message",
        audioUrl: "https://example.com/audio/demo.mp3", // This would be a real URL in production
        audioDuration: 12,
        sender: "user",
        timestamp: new Date(Date.now() - 3400000),
      },
      {
        id: "msg4",
        content: "I heard your message. Thank you for sharing your feelings. Is there anything specific you'd like to talk about?",
        sender: "ai",
        timestamp: new Date(Date.now() - 3300000),
      }
    ];
    
    setMessages(mockMessages);
    
    // Fetch chat history from API - commented out for now
    // fetchChatHistory("1", userId);

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
          reactions: [],
          isAudio: item.isAudio || false,
          audioUrl: item.audioUrl || null,
          audioDuration: item.audioDuration || 0
        })).concat(response.data.history.map((item: any) => ({
          id: `ai-${item._id || Math.random().toString(36).substring(2, 9)}`,
          content: item.botResponse,
          sender: "ai",
          timestamp: new Date((item.timestamp || Date.now()) + 1000), // Add 1 second to ensure proper ordering
          reactions: [],
          isAudio: item.isAudio || false,
          audioUrl: item.audioUrl || null,
          audioDuration: item.audioDuration || 0
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
    setShowAudioOptions(false);
  };

  // Toggle quick responses
  const toggleQuickResponses = () => {
    setShowQuickResponses(prev => !prev);
    setShowEmojiPicker(false);
    setShowAudioOptions(false);
  };

  // Toggle options menu
  const toggleOptions = () => {
    setShowOptions(prev => !prev);
    setShowAudioOptions(false);
  };

  // Toggle audio options menu
  const toggleAudioOptions = () => {
    setShowAudioOptions(prev => !prev);
    setShowEmojiPicker(false);
    setShowQuickResponses(false);
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

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        
        // In a real app, you would upload this to a server and get a URL
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Send audio message
        const audioMessage: Message = {
          id: `user-audio-${Date.now()}`,
          content: "Audio message",
          id: `user-audio-${Date.now()}`,
          content: "Audio message",
          sender: "user",
          timestamp: new Date(),
          isNew: true,
          isAudio: true,
          audioUrl: audioUrl,
          audioDuration: recordingTime
        };
        
        setMessages(prev => [...prev, audioMessage]);
        setIsTyping(true);
        
        // Simulate AI response after audio message
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
        
        // In a real application, you would send the audio to a backend for processing
        // For example, transcribing the audio and then sending it to your chatbot API
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Set up recording timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Play audio message
  const playAudio = (audioUrl: string, messageId: string) => {
    // Stop any currently playing audio
    Object.values(audioPlayerRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    // Reset all playing states
    setIsPlaying({});
    
    // Create or get audio element
    let audio = audioPlayerRefs.current[messageId];
    if (!audio) {
      audio = new Audio(audioUrl);
      audioPlayerRefs.current[messageId] = audio;
      
      // Set volume based on user preference
      audio.volume = audioVolume / 100;
      
      // Add event listeners
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
    }
    
    // Play the audio
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  };

  // Stop audio message
  const stopAudio = (audioUrl: string, messageId: string) => {
    const audio = audioPlayerRefs.current[messageId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setIsPlaying(prev => ({ ...prev, [messageId]: false }));
  };

  // Change audio volume
  const changeAudioVolume = (volume: number) => {
    setAudioVolume(volume);
    
    // Update volume for all existing audio players
    Object.values(audioPlayerRefs.current).forEach(audio => {
      audio.volume = volume / 100;
    });
  };

  // Toggle audio feedback
  const toggleAudioFeedback = () => {
    setAudioFeedback(prev => !prev);
  };

  // Format time for audio display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Generate a waveform visualization for audio messages (simplified version)
  const generateWaveform = (messageId: string, playing: boolean) => {
    // In a real app, you would analyze the audio data to create a real waveform
    // This is a simplified visual representation
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

  // Change theme using the context
  const changeTheme = (newTheme: "purple" | "cosmic" | "night") => {
    setTheme(newTheme);
    setShowOptions(false);
  };

  // Send an AI audio message (simulated for demo)
  const simulateAIAudioMessage = () => {
    // In a real app, this would be a real audio URL from your backend
    const mockAudioUrl = "https://example.com/audio/ai-response.mp3";
    
    setIsTyping(true);
    
    setTimeout(() => {
      const aiAudioMessage: Message = {
        id: `ai-audio-${Date.now()}`,
        content: "Audio message from AI",
        sender: "ai",
        timestamp: new Date(),
        isNew: true,
        isAudio: true,
        audioUrl: mockAudioUrl,
        audioDuration: 8 // Mock duration
      };
      
      setMessages(prev => [...prev, aiAudioMessage]);
      setIsTyping(false);
    }, 1500);
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
          
          {/* Audio Options Menu */}
          {showAudioOptions && (
            <div 
              ref={audioOptionsRef}
              className="absolute top-16 right-16 w-56 bg-black/70 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden z-20"
            >
              <div className="p-3">
                <h4 className="text-xs text-white/60 px-2 py-1">Audio Settings</h4>
                
                <div className="mt-2">
                  <label className="text-sm text-white/80 flex justify-between items-center">
                    <span>Volume</span>
                    <span className="text-xs text-purple-300">{audioVolume}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={audioVolume} 
                    onChange={(e) => changeAudioVolume(parseInt(e.target.value))} 
                    className="w-full h-2 bg-white/20 rounded-full mt-1 appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-white/80">Audio Feedback</span>
                  <button 
                    onClick={toggleAudioFeedback}
                    className={`p-2 rounded-full ${audioFeedback ? 'bg-purple-600' : 'bg-white/10'} transition-colors`}
                  >
                    {audioFeedback ? <FaVolumeUp className="text-white" /> : <FaVolumeMute className="text-white/60" />}
                  </button>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <button 
                    onClick={simulateAIAudioMessage}
                    className={`w-full text-sm p-2 rounded bg-white/10 hover:bg-white/20 text-white/90 transition-colors flex items-center justify-center space-x-2`}
                  >
                    <FaMicrophone className="text-purple-400" />
                    <span>Test Audio Response</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
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
  onClick={() => isPlaying[message.id] 
    ? stopAudio(message.audioUrl!, message.id) 
    : playAudio(message.audioUrl!, message.id)
  }
  className={`w-10 h-10 rounded-full flex items-center justify-center ${
    isPlaying[message.id] 
      ? "bg-red-500 hover:bg-red-600" 
      : "bg-purple-600 hover:bg-purple-700"
  } transition-colors`}
>
  {isPlaying[message.id] 
    ? <FaStop className="text-white text-sm" /> 
    : <FaPlay className="text-white text-sm ml-0.5" />
  }
</button>

{/* Waveform visualization */}
<div className="flex-grow">
  {generateWaveform(message.id, isPlaying[message.id] || false)}
  
  {/* Duration display */}
  <div className="text-xs text-white/70 mt-1">
    {formatTime(message.audioDuration || 0)}
  </div>
</div>
</div>
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
</div>


{isTyping && (
  <div className="flex items-end my-4">
    <div className={`w-8 h-8 rounded-full ${themeStyles.aiAvatar} flex items-center justify-center mr-2 mb-1 shadow-lg`}>
      <span className="text-white text-xs font-bold">AI</span>
    </div>
    <div className={`${themeStyles.aiMessage} rounded-xl px-4 py-3 shadow-lg`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  </div>
)}

<div ref={messagesEndRef} />

{/* Input area */}
<div className={`p-4 border-t ${themeStyles.inputBorder} transition-colors duration-500`}>
  {/* Quick responses */}
  {showQuickResponses && (
    <div className="flex overflow-x-auto py-2 pb-4 no-scrollbar">
      <div className="flex space-x-2">
        {quickResponses.map((response, index) => (
          <button
            key={index}
            onClick={() => handleQuickResponse(response)}
            className={`${themeStyles.quickResponse} whitespace-nowrap px-3 py-2 rounded-full text-sm shadow-lg`}
          >
            {response}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* Recording UI */}
  {isRecording ? (
    <div className={`${themeStyles.recordingContainer} rounded-2xl p-4 mb-4 shadow-lg flex items-center justify-between`}>
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white font-medium">Recording... {formatTime(recordingTime)}</span>
      </div>
      <button
        onClick={stopRecording}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
      >
        <FaStop />
      </button>
    </div>
  ) : null}

  {/* Emoji picker */}
  {showEmojiPicker && (
    <div 
      ref={emojiPickerRef}
      className={`${themeStyles.emojiPicker} border border-white/10 rounded-2xl shadow-2xl p-2 mb-4 max-h-60 overflow-y-auto`}
    >
      <div className="flex mb-2 space-x-1">
        {emojiCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={`p-2 rounded-lg ${
              activeCategory === index 
                ? themeStyles.emojiCategoryActive 
                : themeStyles.emojiCategory
            } transition-colors`}
          >
            {category.name.slice(0, 1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-8 gap-1">
        {emojiCategories[activeCategory].emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => addEmoji(emoji)}
            className={`text-xl p-1 rounded hover:bg-white/10 transition-colors`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )}

  <div className={`flex items-center rounded-2xl ${themeStyles.inputBackground} p-1 pl-4 shadow-lg transition-colors`}>
    <input
      ref={inputRef}
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      placeholder="Type a message..."
      className="bg-transparent text-white placeholder-white/50 flex-grow outline-none"
    />

    <div className="flex items-center space-x-1">
      <button
        onClick={toggleQuickResponses}
        className="p-2 text-white opacity-70 hover:opacity-100 transition-opacity"
      >
        <FaStar className="text-lg" />
      </button>
      
      <button
        onClick={toggleEmojiPicker}
        className="p-2 text-white opacity-70 hover:opacity-100 transition-opacity emoji-toggle-button"
      >
        <FaSmile className="text-lg" />
      </button>

      {/* Microphone/Recording button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-3 rounded-full ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : `${themeStyles.micButton} hover:bg-opacity-80`
        } ml-1 transition-colors`}
      >
        {isRecording ? (
          <FaStop className="text-white" />
        ) : (
          <FaMicrophone className="text-white" />
        )}
      </button>

      {/* Send button */}
      <button
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
        className={`p-3 rounded-full ${
          newMessage.trim()
            ? `${themeStyles.sendButton} hover:bg-opacity-80`
            : "bg-white/10 cursor-not-allowed"
        } ml-1 transition-colors`}
      >
        <FaPaperPlane className="text-white" />
      </button>
    </div>
  </div>
</div>
};

export default ChatDetail;
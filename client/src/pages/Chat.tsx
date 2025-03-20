import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FaArrowLeft, FaPaperPlane, FaSmile, FaTimes, FaEllipsisV, FaStar 
} from "react-icons/fa";
import { useTheme } from "../layout/ThemeProvider"; // Assuming same path structure
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define message type
interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  reactions?: string[];
  isNew?: boolean;
}

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

const Chat = () => {
  // Theme context
  const { theme, setTheme, themeStyles } = useTheme();
  
  // States
  const [showTitlePrompt, setShowTitlePrompt] = useState(true);
  const [chatTitle, setChatTitle] = useState("");
  const [titleInput, setTitleInput] = useState("");

  const navigate = useNavigate();

  
  const handleTitleSubmit = async () => {
    try {
      if (!titleInput.trim()) return;
      setChatTitle(titleInput);
      setShowTitlePrompt(false);

      const userDetails = localStorage.getItem("user");
      if (!userDetails) {
        console.error("Error: USER data is missing in localStorage.");
        return;
      }

      const userObject = JSON.parse(userDetails);

      const storedUserId = userObject.id;

      // console.log("storedUserId : " ,storedUserId);
    
      const response = await axios.post("http://localhost:5000/api/chat/create-category", {
        userId: storedUserId, 
        topic: titleInput.trim()
      });

      navigate(`/chat/${response.data.chatId}`, { 
        state: { title: titleInput } 
      });

  
      // console.log(response.data);
    } catch (err) {
      console.error("Error creating chat category:", err);
    }
   
  };




  // Title prompt screen
  return (
 
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md ${themeStyles.card} p-6 rounded-xl shadow-xl backdrop-blur-sm`}
          >
            <h2 className="text-xl text-white font-semibold mb-4 text-center">
              What would you like to chat about?
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 ${themeStyles.inputField} text-white placeholder-gray-400`}
                placeholder="Enter chat title..."
                aria-label="Chat title"
              />
            </div>
            <button
              onClick={handleTitleSubmit}
              disabled={!titleInput.trim()}
              className={`w-full ${themeStyles.button} text-white p-3 rounded-lg shadow-md transition-all disabled:opacity-50`}
            >
              Start Chat
            </button>
          </motion.div>
        </div>
    );

};

export default Chat;
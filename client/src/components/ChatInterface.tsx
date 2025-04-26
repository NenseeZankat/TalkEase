import { FC, useState, useEffect, useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTimes, FaSearch, FaFilter } from "react-icons/fa";
import { useTheme } from "../layout/ThemeProvider"; // Import the theme hook
import axios from "axios";
import { motion } from "framer-motion";
import Chat from "../pages/Chat";

interface Chat {
  id: string;
  title: string;
  messageCount: number;
  category: string;
}

const ChatInterface: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const { themeStyles } = useTheme(); // Get theme styles from context
  const [chatCategories, setChatCategories] = useState<
    { id: string; topic: string; totalCounts: number }[]
  >([]);


  const categories = ["All", "Emotion", "Academic", "Mental Health", "Relationship", "Holiday"];

  // Header parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchChatsByUser();
  },[])

  // Background animation effect
  useEffect(() => {
    // Create canvas for header background animation
    const canvas = document.getElementById('header-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const headerElement = document.querySelector('.header-gradient');
      if (headerElement) {
        canvas.width = headerElement.clientWidth;
        canvas.height = headerElement.clientHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle properties
    const particlesArray: Particle[] = [];
    const numberOfParticles = 70;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      pulseSpeed: number;
      pulseAmount: number;
      baseSize: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 4 + 1;
        this.size = this.baseSize;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.pulseSpeed = Math.random() * 0.1 + 0.05;
        this.pulseAmount = Math.random() * 1 + 0.5;
        
        // Enhanced color palette with more vibrant options
        const colors = [
          '#ff007f', // Bright pink
          '#c77dff', // Lavender
          '#7b2cbf', // Deep purple
          '#480ca8', // Indigo
          '#3f37c9', // Blue-violet
          '#4cc9f0'  // Cyan
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.7 + 0.3;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Pulse size animation
        this.size = this.baseSize + Math.sin(Date.now() * this.pulseSpeed) * this.pulseAmount;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }
    
    // Create particles
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Add connecting lines between nearby particles
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particlesArray[a].color;
            ctx.globalAlpha = 0.2 * (1 - distance / 100);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  // Chat item hover effect
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const fetchChatsByUser = async () => {
    try {
      const userDetails = localStorage.getItem("user");
      if (!userDetails) {
        console.error("Error: USER data is missing in localStorage.");
        return;
      }

      const userObject = JSON.parse(userDetails);

      const userId = userObject.id;
      
      const response = await axios.get(`http://localhost:5000/api/chat/categoryByUser/${userId}`)
      console.log(response.data);

      const categories = response.data.map((chat: any) => ({
        id: chat._id, 
        topic: chat.topic,
        totalCounts: chat.totalChats,
      }));

      setChatCategories(categories);
      setReload(false);

    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    fetchChatsByUser();
  }, [reload]);


  // const handleNewChat = () => {
  //   if (newChatTitle.trim()) {
  //     // In a real app, you'd generate a unique ID and save the chat
  //     const newChatId = `new-${Date.now()}`;
  //     console.log("New Chat Created:", newChatTitle, "ID:", newChatId);
  //     setNewChatTitle("");
  //     setIsModalOpen(false);
      
  //     // Navigate to the new chat with its ID
  //     navigate(`/chat/${newChatId}`, { 
  //       state: { title: newChatTitle } 
  //     });
  //   }
  // };

  const handleChatClick = (chatId: string, chatTitle: string) => {
    // Navigate to the selected chat with its ID
    navigate(`/chat/${chatId}`, {
      state: { title: chatTitle }
    });
  };
  

  // Chat item component for reuse
  const ChatItem = ({ chat }: { chat: Chat }) => {
    const isHovered = hoveredChat === chat.id;
    
    // Generate random gradient angles for variation
    const gradientAngle = Math.floor(Math.random() * 360);
    
    const navigate = useNavigate(); 

    const handleAnalyze = (event: React.MouseEvent) => {
        event.stopPropagation(); 
        navigate(`/chatanalytics/${chat.id}`);
    };

    return (
        <div 
            className={`flex items-center p-5 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                isHovered 
                    ? 'transform scale-[1.02] z-10' 
                    : `${themeStyles.card} hover:${themeStyles.hoverEffect}`
            }`}
            onClick={() => handleChatClick(chat.id, chat.title)}
            onMouseEnter={() => setHoveredChat(chat.id)}
            onMouseLeave={() => setHoveredChat(null)}
        >
            {/* Background glow effect on hover */}
            {isHovered && (
                <div className={`absolute inset-0 ${themeStyles.card} opacity-70 rounded-xl shadow-lg z-0 `}></div>
            )}
            
            {/* Chat content */}
            <div className="relative z-10 flex items-center w-full">
                <div 
                    className="w-12 h-12 rounded-full mr-4 flex items-center justify-center transition-all shadow-lg border"
                    style={{ 
                        background: isHovered ? themeStyles.userAvatar : themeStyles.aiAvatar,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                >
                    <span className="text-white text-sm font-bold">{chat.title.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-grow">
                    <p className="font-medium text-white">{chat.title}</p>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-400">{chat.messageCount} Total</span>
                        {/* <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(chat.category)}`}>
                            {chat.category}
                        </span> */}
                    </div>
                </div>

                <button  
                    onClick={handleAnalyze}
                    className="px-4 py-2 text-sm font-medium text-white border-2 rounded-lg shadow-md transition-all relative"
                >
                    Analyze
                </button>


            </div>
        </div>
    );
  };


  // Get category styling
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "Emotion":
        return "bg-[#ff007f]/20 text-[#ff007f]";
      case "Academic":
        return "bg-[#4cc9f0]/20 text-[#4cc9f0]";
      case "Mental Health":
        return "bg-[#8338ec]/20 text-[#8338ec]";
      case "Relationship":
        return "bg-[#fb5607]/20 text-[#fb5607]";
      case "Holiday":
        return "bg-[#06d6a0]/20 text-[#06d6a0]";
      default:
        return "bg-[#c77dff]/20 text-[#c77dff]";
    }
  };

  return (
    <div className={`flex h-screen ${themeStyles.pageContainer} text-white transition-all rounded-xl shadow-2xl`}>
      {/* Main content */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${isModalOpen ? 'blur-sm' : ''}`}>
        <div 
          ref={headerRef}
          className={`header-gradient ${themeStyles.header} p-16 rounded-b-3xl shadow-lg text-center relative overflow-hidden`}
        >
          {/* Canvas for the header animation */}
          <canvas id="header-canvas" className="absolute inset-0 w-full h-full"></canvas>
          
          {/* Header content */}
          <div className="relative z-10">
            <h1 className="text-white text-3xl font-bold mb-2">Chat Conversations</h1>
            {/* <p className="text-gray-200 text-sm">1571 Total &bull; 32 Left this Month</p> */}
            
            {/* Search and filter bar */}
            {/* <div className="mt-6 flex justify-center">
              <div className={`relative ${themeStyles.inputField} backdrop-blur-md rounded-l-full border-y border-l border-gray-700 w-64 flex items-center px-4`}>
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="bg-transparent border-none outline-none text-white py-2 w-full placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={`relative ${themeStyles.inputField} backdrop-blur-md rounded-r-full border-y border-r border-gray-700 px-4 flex items-center`}>
                <FaFilter className="text-gray-400 mr-2" />
                <select 
                  className="bg-transparent border-none outline-none text-white py-2 appearance-none pr-8"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category} className={`${themeStyles.inputField} text-white`}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col flex-grow p-8 space-y-6 overflow-y-auto">

            <div>
              <h2 className="text-lg font-semibold text-[#c77dff] pb-2 relative mb-4">
                Past ({chatCategories.length})
                <div className={`absolute bottom-0 left-0 w-20 h-0.5 ${themeStyles.divider}`}></div>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chatCategories.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={{
                      id: chat.id,
                      title: chat.topic,
                      messageCount: chat.totalCounts, 
                      category: "General", 
                    }}
                  />
                ))}
                {chatCategories.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No chats found matching your criteria
                  </div>
                )}
              </div>
            </div>

          </div>


          {/* New chat button with animated glow */}
          <button
            className={`fixed bottom-6 right-6 ${themeStyles.button} p-5 rounded-full shadow-lg transition-all cursor-pointer group`}
            onClick={() => setIsModalOpen(true)}
          >
            <div className={`absolute inset-0 rounded-full ${themeStyles.button} blur-md opacity-0 group-hover:opacity-70 transition-opacity`}></div>
            <FaPlus className="text-white text-2xl relative z-10" />
          </button>
        </div>

      {/* Modal for new chat - with backdrop blur and animation */}
      {isModalOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${themeStyles.modalBg}`}>
          <div 
            className={`${themeStyles.card} rounded-xl shadow-2xl z-10 overflow-hidden transform transition-all`}
            style={{
              animation: 'modalAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Modal header with gradient */}
            <div className={`${themeStyles.header} px-6 py-4 flex justify-between items-center`}>
              <h3 className="text-xl font-bold text-white">Create New Chat</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <Chat/>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalAppear {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(199, 125, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(199, 125, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(199, 125, 255, 0); }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
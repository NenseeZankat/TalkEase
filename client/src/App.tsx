import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, createContext, useContext, useEffect, ReactNode } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./index.css";
import { FaHome, FaComments, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt, FaMoon, FaSun, FaMagic } from "react-icons/fa";
import ChatDetail from "./components/ChatDetail";
import { ThemeProvider, useTheme } from "./layout/ThemeProvider";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage component
import ChatAnalytics from "./pages/ChatAnalytics";

// Define the auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create auth context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// AuthProvider props type
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
// PrivateRoute Component
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Theme Selector Component
const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowThemeOptions(!showThemeOptions)}
        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700/30 w-full text-left"
      >
        {theme === "purple" ? <FaMagic /> : theme === "cosmic" ? <FaSun /> : <FaMoon />}
        <span>Theme</span>
      </button>

      {showThemeOptions && (
        <div className="absolute left-0 mt-1 w-full rounded-md shadow-lg overflow-hidden z-30 bg-black/70 backdrop-blur-lg border border-white/20">
          <div className="py-1">
            <button 
              onClick={() => { setTheme("purple"); setShowThemeOptions(false); }}
              className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-purple-900/50"
            >
              <FaMagic className="mr-2" /> Purple Dream
            </button>
            <button 
              onClick={() => { setTheme("cosmic"); setShowThemeOptions(false); }}
              className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-indigo-900/50"
            >
              <FaSun className="mr-2" /> Cosmic Vibes
            </button>
            <button 
              onClick={() => { setTheme("night"); setShowThemeOptions(false); }}
              className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-blue-900/50"
            >
              <FaMoon className="mr-2" /> Night Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App component with theme integration
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { themeStyles } = useTheme();
  
  return (
    <Router>
      <div className={`flex h-screen relative ${themeStyles.background} transition-all duration-500`}>
        {/* Sidebar toggle and sidebar */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "filter blur-sm" : ""}`}>
          <div className="fixed top-4 left-4 z-30">
            <button 
              className={`${themeStyles.aiMessage} text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <Routes>
            {/* Route for landing page */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/chat/:chatId" element={<PrivateRoute><ChatDetail /></PrivateRoute>} />
            <Route path="/chatanalytics/:chatCategoryId" element={<ChatAnalytics/>} />
          </Routes>
        </div>

        <div 
          className={`fixed top-0 left-0 h-full ${themeStyles.sidebar} text-white p-5 flex flex-col space-y-6 shadow-lg transition-all duration-300 z-20 backdrop-blur-sm border-r border-white/10 ${
            isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
          }`}
        >
          <button 
            className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
          <div className="pt-12">
            <h2 className="text-xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">TalkEase</h2>
            
            <nav className="flex flex-col space-y-3">
              <Link 
                to={isAuthenticated ? "/home" : "/"} 
                className={`flex items-center space-x-2 p-3 rounded-lg ${themeStyles.navItem} transition-colors`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaHome /> <span>Home</span>
              </Link>
              <Link 
                to="/chat" 
                className={`flex items-center space-x-2 p-3 rounded-lg ${themeStyles.navItem} transition-colors`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaComments /> <span>Chat</span>
              </Link>

              <ThemeSelector />

              <div className={`my-2 h-px ${themeStyles.divider} opacity-30`}></div>

              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    logout();
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${themeStyles.navItem} transition-colors text-left`}
                >
                  <FaSignOutAlt /> <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`flex items-center space-x-2 p-3 rounded-lg ${themeStyles.navItem} transition-colors`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaSignInAlt /> <span>Login</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`flex items-center space-x-2 p-3 rounded-lg ${themeStyles.navItem} transition-colors`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaUserPlus /> <span>Signup</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

// Wrap everything with providers
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, createContext, useContext, useEffect, ReactNode } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./index.css";
import { FaHome, FaComments, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import ChatDetail from "./components/ChatDetail";

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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen relative">
          {/* Main Content with blur effect when sidebar is open */}
          <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "filter blur" : ""}`}>
            <div className="fixed top-4 left-4 z-30">
              <button 
                className="bg-gray-800 text-white p-3 rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:chatId" element={<ChatDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
          
          {/* Sidebar */}
          <div 
            className={`fixed top-0 left-0 h-full bg-gray-900 text-white p-5 flex flex-col space-y-6 shadow-lg transition-all duration-300 z-20 ${
              isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
            }`}
          >
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
            <div className="pt-12">
              <h2 className="text-xl font-bold text-center mb-6">Chat App</h2>
              
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaHome /> <span>Home</span>
                </Link>
                <Link 
                  to="/chat" 
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaComments /> <span>Chat</span>
                </Link>
                
                {isAuthenticated ? (
                  <button 
                    onClick={() => {
                      logout();
                      setIsSidebarOpen(false);
                    }}
                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 text-left"
                  >
                    <FaSignOutAlt /> <span>Logout</span>
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <FaSignInAlt /> <span>Login</span>
                    </Link>
                    <Link 
                      to="/signup" 
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <FaUserPlus /> <span>Signup</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
          
          {/* Transparent overlay to handle click outside to close sidebar */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
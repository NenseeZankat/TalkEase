import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
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

// Sidebar props type
interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className={`bg-gray-900 text-white p-5 flex flex-col space-y-6 transition-transform ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
      <button className="self-end text-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      {isSidebarOpen && (
        <>
          <h2 className="text-xl font-bold text-center">Chat App</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
              <FaHome /> <span>Home</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
              <FaComments /> <span>Chat</span>
            </Link>
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 text-left"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
                  <FaSignInAlt /> <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
                  <FaUserPlus /> <span>Signup</span>
                </Link>
              </>
            )}
          </nav>
        </>
      )}
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen">
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          
          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:chatId" element={<ChatDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
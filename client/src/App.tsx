import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./index.css";
import { FaHome, FaComments, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#0d0f18] text-white">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-[#161b22] p-5 shadow-xl border-r border-gray-800 transform transition-transform ${
            isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"
          } md:relative md:w-64 md:translate-x-0`}
        >
          <button className="absolute top-4 right-4 text-xl text-gray-400 hover:text-white md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes />
          </button>
          <h2 className="text-xl font-bold text-center mb-6">Chat App</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
              <FaHome /> <span>Home</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
              <FaComments /> <span>Chat</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
              <FaSignInAlt /> <span>Login</span>
            </Link>
            <Link to="/signup" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
              <FaUserPlus /> <span>Signup</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Toggle Button (Always Visible) */}
        <button
          className="fixed top-4 left-4 z-50 bg-[#1a1b26] text-gray-400 p-3 rounded-full shadow-lg hover:text-white md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>

        {/* Main Content */}
        <div className="flex-1 min-h-screen p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

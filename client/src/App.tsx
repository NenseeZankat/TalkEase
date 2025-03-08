import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./index.css";
import { FaHome, FaComments, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
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
                <Link to="/login" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
                  <FaSignInAlt /> <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
                  <FaUserPlus /> <span>Signup</span>
                </Link>
              </nav>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
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

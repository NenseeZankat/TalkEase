import { FC } from "react";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here
    // This could include clearing tokens from localStorage, resetting state, etc.
    localStorage.removeItem("authToken"); // Example - remove auth token
    
    // Close the sidebar
    setIsOpen(false);
    
    // Navigate to login page
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar Toggle Button - Hide When Open */}
      {!isOpen && (
        <button
          className="fixed top-6 left-6 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-6 shadow-lg z-50"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-700 p-2 rounded-full"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 mt-8">Menu</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 cursor-pointer block transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="hover:text-gray-300 cursor-pointer block transition"
              onClick={() => setIsOpen(false)}
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="hover:text-gray-300 cursor-pointer block transition"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="hover:text-gray-300 cursor-pointer block transition"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
          </li>
        </ul>

        {/* Logout Section - Added at the bottom with separator */}
        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="border-t border-gray-700 pt-4 w-full"></div>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-400 hover:text-red-300 cursor-pointer transition mt-2 w-full"
          >
            <FaSignOutAlt className="mr-2" size={16} />
            Logout
          </button>
        </div>
      </motion.div>
    </>
  );
};
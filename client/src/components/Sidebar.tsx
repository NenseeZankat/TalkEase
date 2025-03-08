import { FC } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="relative">
      {/* Sidebar Toggle Button - Hide When Open */}
      {!isOpen && (
        <button
          className="fixed top-6 left-6 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-6 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-700 p-2 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 mt-8">Menu</h2>
        <ul className="space-y-4">
          <li className="hover:text-gray-300 cursor-pointer">Home</li>
          <li className="hover:text-gray-300 cursor-pointer">Chat</li>
          <li className="hover:text-gray-300 cursor-pointer">Profile</li>
          <li className="hover:text-gray-300 cursor-pointer">Settings</li>
        </ul>
      </div>
    </div>
  );
};

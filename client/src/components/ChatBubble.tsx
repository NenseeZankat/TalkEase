import { FC } from "react";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  sender: "user" | "bot";
  text: string;
}

const ChatBubble: FC<ChatBubbleProps> = ({ sender, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl max-w-md sm:max-w-lg ${
        sender === "user"
          ? "ml-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
          : "bg-gray-800 text-gray-200 shadow-md"
      }`}
    >
      {text}
    </motion.div>
  );
};

export default ChatBubble;

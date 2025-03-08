import { FC } from "react";

interface ChatBubbleProps {
  sender: "user" | "bot";
  text: string;
}

const ChatBubble: FC<ChatBubbleProps> = ({ sender, text }) => {
  return (
    <div className={`p-3 rounded-lg max-w-xs ${sender === "user" ? "ml-auto bg-blue-500 text-white" : "bg-gray-200"}`}>
      {text}
    </div>
  );
};

export default ChatBubble;

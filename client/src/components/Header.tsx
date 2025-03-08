import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white p-4 flex items-center rounded-b-lg shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      <h1 className="flex-1 text-center text-lg font-semibold">My Conversations</h1>
    </header>
  );
};

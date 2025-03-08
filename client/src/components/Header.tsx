import { FC } from "react";
import { ArrowLeft } from "lucide-react";

export const Header: FC = () => {
  return (
    <header className="w-full bg-orange-400 text-white p-4 flex items-center justify-between rounded-b-lg shadow-md">
      <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition">
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      <h1 className="text-lg font-semibold">My Conversations</h1>
      <div className="w-8" /> {/* Placeholder for spacing balance */}
    </header>
  );
};

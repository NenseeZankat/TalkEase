import { FC } from "react";
import { FaPlus, FaClock } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";

const Home: FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FAE7D5]">
      {/* Header */}
      <div className="w-full bg-gradient-to-b from-[#E07A4E] to-[#E28A5D] text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-xl font-bold">My Conversations</h1>
        <div className="flex justify-between mt-2 text-sm">
          <span>🔄 1571 Total</span>
          <span>💬 32 Left this Month</span>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="mt-4 w-full px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent (4)</h2>
          <button className="text-gray-600 text-sm flex items-center">
            Newest <FaClock className="ml-1" />
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {[
            { title: "Recent Breakup, felt sad", status: "Sad" },
            { title: "Shitty Teacher at University", status: "Happy" },
            { title: "Just wanna stop existing", status: "Overjoyed" },
          ].map((chat, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-white rounded-xl shadow-md"
            >
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <IoChatbubblesOutline className="text-xl text-green-700" />
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="text-sm font-medium">{chat.title}</h3>
                <p className="text-xs text-gray-500">478 Total • {chat.status}</p>
              </div>
              <button className="text-gray-400">•••</button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
        <FaPlus className="text-2xl" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white py-3 flex justify-around text-gray-600 shadow-md">
        <button className="flex flex-col items-center">
          <IoChatbubblesOutline className="text-2xl" />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center">
          <FaClock className="text-2xl" />
          <span className="text-xs">History</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
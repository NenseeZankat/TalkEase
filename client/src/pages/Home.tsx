import { lazy, Suspense } from "react";

const ChatInterface = lazy(() => import("../components/ChatInterface"));

const Home = () => {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading chat...</div>}>
      <ChatInterface />
    </Suspense>
  );
};

export default Home;

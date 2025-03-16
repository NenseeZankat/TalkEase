import { FC, useState, useRef } from "react";
import { FaPaperPlane, FaSmile, FaStar, FaMicrophone, FaStop } from "react-icons/fa";
import { emojiCategories } from "../assets/emojiCategories";
import { db, storage } from "../firebaseconfig"; 
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAudioMessage: (audioUrl: string, duration: number) => void;
  themeStyles: any;
}
const userId = "67d053a0b18cab97965e65d0";

const ChatInput: FC<ChatInputProps> = ({ onSendMessage, onAudioMessage, themeStyles }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quick response suggestions
  const quickResponses = [
    "Thanks for your help! 👍",
    "I'll think about it 🤔",
    "Can you explain more? 🧐",
    "That's exactly what I needed! ✨"
  ];

  // Send message handler
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      setShowEmojiPicker(false);
      setShowQuickResponses(false);
    }
  };

  // Handle quick response selection
  const handleQuickResponse = (response: string) => {
    setNewMessage(response);
    setShowQuickResponses(false);
    inputRef.current?.focus();
  };

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    setShowQuickResponses(false);
  };

  // Toggle quick responses
  const toggleQuickResponses = () => {
    setShowQuickResponses(prev => !prev);
    setShowEmojiPicker(false);
  };

  // Format time for audio display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        // In a real app, you would upload this to a server and get a URL
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Send audio message to parent component
        onAudioMessage(audioUrl, recordingTime);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Set up recording timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };
  const saveAudioToFirebase = async (audioBlob: Blob, userId: string) => {
    const timestamp = new Date().getTime();
    const fileName = `${userId}_${timestamp}.webm`;
  
    // Upload audio file to Firebase Storage
    const storageRef = Storage.ref().child(`audioMessages/${fileName}`);
    await storageRef.put(audioBlob);
    const audioUrl = await storageRef.getDownloadURL();
  
    // Save audio URL and metadata to Firestore
    await db.collection("audioMessages").add({
      userId,
      audioUrl,
      timestamp,
      duration: recordingTime,
    });
  
    // Pass audio URL back to parent component
    onAudioMessage(audioUrl, recordingTime);
  };
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  mediaRecorderRef.current?.addEventListener("stop", () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    saveAudioToFirebase(audioBlob, userId);
    audioChunksRef.current = [];
  });
  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  return (
    <div className={`p-4 border-t ${themeStyles.inputBorder} transition-colors duration-500`}>
      {/* Quick responses */}
      {showQuickResponses && (
        <div className="flex overflow-x-auto py-2 pb-4 no-scrollbar">
          <div className="flex space-x-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className={`${themeStyles.quickResponse} whitespace-nowrap px-3 py-2 rounded-full text-sm shadow-lg`}
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recording UI */}
      {isRecording ? (
        <div className={`${themeStyles.recordingContainer} rounded-2xl p-4 mb-4 shadow-lg flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Recording... {formatTime(recordingTime)}</span>
          </div>
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
          >
            <FaStop />
          </button>
        </div>
      ) : null}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className={`${themeStyles.emojiPicker} border border-white/10 rounded-2xl shadow-2xl p-2 mb-4 max-h-60 overflow-y-auto`}
        >
          <div className="flex mb-2 space-x-1">
            {emojiCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`p-2 rounded-lg ${
                  activeCategory === index 
                    ? themeStyles.emojiCategoryActive 
                    : themeStyles.emojiCategory
                } transition-colors`}
              >
                {category.name.slice(0, 1)}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-8 gap-1">
            {emojiCategories[activeCategory].emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className={`text-xl p-1 rounded hover:bg-white/10 transition-colors`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`flex items-center rounded-2xl ${themeStyles.inputBackground} p-1 pl-4 shadow-lg transition-colors`}>
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="bg-transparent text-white placeholder-white/50 flex-grow outline-none"
        />

        <div className="flex items-center space-x-1">
          <button
            onClick={toggleQuickResponses}
            className="p-2 text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <FaStar className="text-lg" />
          </button>
          
          <button
            onClick={toggleEmojiPicker}
            className="p-2 text-white opacity-70 hover:opacity-100 transition-opacity emoji-toggle-button"
          >
            <FaSmile className="text-lg" />
          </button>

          {/* Microphone/Recording button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : `${themeStyles.micButton} hover:bg-opacity-80`
            } ml-1 transition-colors`}
          >
            {isRecording ? (
              <FaStop className="text-white" />
            ) : (
              <FaMicrophone className="text-white" />
            )}
          </button>

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full ${
              newMessage.trim()
                ? `${themeStyles.sendButton} hover:bg-opacity-80`
                : "bg-white/10 cursor-not-allowed"
            } ml-1 transition-colors`}
          >
            <FaPaperPlane className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
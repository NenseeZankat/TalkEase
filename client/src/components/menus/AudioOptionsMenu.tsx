import { FC, forwardRef } from "react";
import { FaVolumeUp, FaVolumeMute, FaMicrophone } from "react-icons/fa";

interface AudioOptionsMenuProps {
  audioVolume: number;
  audioFeedback: boolean;
  changeAudioVolume: (volume: number) => void;
  toggleAudioFeedback: () => void;
  simulateAIAudioMessage: () => void;
}

const AudioOptionsMenu = forwardRef<HTMLDivElement, AudioOptionsMenuProps>(({
  audioVolume,
  audioFeedback,
  changeAudioVolume,
  toggleAudioFeedback,
  simulateAIAudioMessage
}, ref) => {
  return (
    <div 
      ref={ref}
      className="absolute top-16 right-16 w-56 bg-black/70 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden z-20"
    >
      <div className="p-3">
        <h4 className="text-xs text-white/60 px-2 py-1">Audio Settings</h4>
        
        <div className="mt-2">
          <label className="text-sm text-white/80 flex justify-between items-center">
            <span>Volume</span>
            <span className="text-xs text-purple-300">{audioVolume}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={audioVolume} 
            onChange={(e) => changeAudioVolume(parseInt(e.target.value))} 
            className="w-full h-2 bg-white/20 rounded-full mt-1 appearance-none cursor-pointer"
          />
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-white/80">Audio Feedback</span>
          <button 
            onClick={toggleAudioFeedback}
            className={`p-2 rounded-full ${audioFeedback ? 'bg-purple-600' : 'bg-white/10'} transition-colors`}
          >
            {audioFeedback ? <FaVolumeUp className="text-white" /> : <FaVolumeMute className="text-white/60" />}
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10">
          <button 
            onClick={simulateAIAudioMessage}
            className={`w-full text-sm p-2 rounded bg-white/10 hover:bg-white/20 text-white/90 transition-colors flex items-center justify-center space-x-2`}
          >
            <FaMicrophone className="text-purple-400" />
            <span>Test Audio Response</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default AudioOptionsMenu;
import { FC, forwardRef } from "react";

interface ThemeOptionsMenuProps {
  currentTheme: string;
  changeTheme: (theme: "purple" | "cosmic" | "night") => void;
}

const ThemeOptionsMenu = forwardRef<HTMLDivElement, ThemeOptionsMenuProps>(({
  currentTheme,
  changeTheme
}, ref) => {
  return (
    <div 
      ref={ref}
      className="absolute top-16 right-4 w-48 bg-black/70 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden z-20"
    >
      <div className="p-2">
        <h4 className="text-xs text-white/60 px-2 py-1">Theme</h4>
        <button 
          onClick={() => changeTheme("purple")}
          className={`w-full text-left text-sm p-2 rounded hover:bg-white/10 transition-colors ${currentTheme === "purple" ? "text-white bg-white/10" : "text-white/80"}`}
        >
          🟣 Purple Dream
        </button>
        <button 
          onClick={() => changeTheme("cosmic")}
          className={`w-full text-left text-sm p-2 rounded hover:bg-white/10 transition-colors ${currentTheme === "cosmic" ? "text-white bg-white/10" : "text-white/80"}`}
        >
          ✨ Cosmic Vibes
        </button>
        <button 
          onClick={() => changeTheme("night")}
          className={`w-full text-left text-sm p-2 rounded hover:bg-white/10 transition-colors ${currentTheme === "night" ? "text-white bg-white/10" : "text-white/80"}`}
        >
          🌃 Night Mode
        </button>
      </div>
    </div>
  );
});

export default ThemeOptionsMenu;
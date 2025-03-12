// Modified ThemeProvider.tsx
import { ReactNode, createContext, useContext, useState, useEffect } from "react";

// Define available themes
export type ThemeType = "purple" | "cosmic" | "night";

// Theme styles interface
export interface ThemeStyles {
  background: string;
  header: string;
  userMessage: string;
  aiMessage: string;
  inputArea: string;
  inputField: string;
  button: string;
  divider: string;
  userAvatar: string;
  aiAvatar: string;
  sidebar: string;
  card: string;
  pageContainer: string;
  navItem: string;
  navItemActive: string;
  modalBg: string;
  hoverEffect: string;
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: "cosmic",
  setTheme: () => {},
  themeStyles: {} as ThemeStyles,
});

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Try to get saved theme from localStorage or use default
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as ThemeType) || "cosmic";
  });

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Get theme styles based on selected theme
  const getThemeStyles = (): ThemeStyles => {
    switch(theme) {
      case "purple":
        return {
          background: "bg-gradient-to-b from-[#0f0f1a] via-[#1a0033] to-[#240046]",
          header: "bg-gradient-to-r from-[#240046] to-[#5a189a]",
          userMessage: "bg-gradient-to-r from-[#7209b7] to-[#560bad]",
          aiMessage: "bg-gradient-to-r from-[#2c2c3e] to-[#3a2f5b]",
          inputArea: "bg-gradient-to-b from-[#1a0033] to-[#240046]",
          inputField: "bg-[#1a1b26]",
          button: "bg-gradient-to-r from-[#ff007f] to-[#6a00f4] hover:from-[#d90429] hover:to-[#560bad]",
          divider: "bg-[#3c096c]",
          userAvatar: "bg-gradient-to-r from-[#c77dff] to-[#e0aaff]",
          aiAvatar: "bg-gradient-to-r from-[#7209b7] to-[#560bad]",
          sidebar: "bg-gradient-to-r from-[#0f0f1a] to-[#1a0033]",
          card: "bg-gradient-to-r from-[#240046]/90 to-[#7209b7]/90 border border-purple-500/20",
          pageContainer: "bg-gradient-to-b from-[#0f0f1a] via-[#1a0033] to-[#240046]",
          navItem: "text-purple-200 hover:bg-purple-900/30",
          navItemActive: "bg-purple-800/50 text-white",
          modalBg: "bg-[#0f0f1a]/90 backdrop-blur-md",
          hoverEffect: "hover:bg-purple-800/30"
        };
      case "cosmic":
        return {
          background: "bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#374151]",
          header: "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]",
          userMessage: "bg-gradient-to-r from-[#818cf8] to-[#6366f1]",
          aiMessage: "bg-gradient-to-r from-[#1e3a8a] to-[#1e40af]",
          inputArea: "bg-gradient-to-b from-[#1f2937] to-[#374151]",
          inputField: "bg-[#111827]",
          button: "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#6366f1] hover:to-[#8b5cf6]",
          divider: "bg-[#6366f1]",
          userAvatar: "bg-gradient-to-r from-[#6366f1] to-[#a5b4fc]",
          aiAvatar: "bg-gradient-to-r from-[#1e40af] to-[#3b82f6]",
          sidebar: "bg-gradient-to-r from-[#111827] to-[#1f2937]",
          card: "bg-gradient-to-r from-[#1e3a8a]/90 to-[#1e40af]/90 border border-indigo-500/20",
          pageContainer: "bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#374151]",
          navItem: "text-indigo-200 hover:bg-indigo-900/30",
          navItemActive: "bg-indigo-800/50 text-white",
          modalBg: "bg-[#111827]/90 backdrop-blur-md",
          hoverEffect: "hover:bg-indigo-800/30"
        };
      case "night":
        return {
          background: "bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]",
          header: "bg-gradient-to-r from-[#0f766e] to-[#0e7490]",
          userMessage: "bg-gradient-to-r from-[#0f766e] to-[#0891b2]",
          aiMessage: "bg-gradient-to-r from-[#1e293b] to-[#0f172a]",
          inputArea: "bg-gradient-to-b from-[#1e293b] to-[#334155]",
          inputField: "bg-[#0f172a]",
          button: "bg-gradient-to-r from-[#0e7490] to-[#0ca5e9] hover:from-[#0891b2] hover:to-[#0ea5e9]",
          divider: "bg-[#0e7490]",
          userAvatar: "bg-gradient-to-r from-[#0ca5e9] to-[#38bdf8]",
          aiAvatar: "bg-gradient-to-r from-[#0f766e] to-[#0e7490]",
          sidebar: "bg-gradient-to-r from-[#0f172a] to-[#1e293b]",
          card: "bg-gradient-to-r from-[#1e293b]/90 to-[#334155]/90 border border-cyan-500/20",
          pageContainer: "bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]",
          navItem: "text-cyan-200 hover:bg-cyan-900/30",
          navItemActive: "bg-cyan-800/50 text-white",
          modalBg: "bg-[#0f172a]/90 backdrop-blur-md",
          hoverEffect: "hover:bg-cyan-800/30"
        };
      default:
        return {
          background: "bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#374151]",
          header: "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]",
          userMessage: "bg-gradient-to-r from-[#818cf8] to-[#6366f1]",
          aiMessage: "bg-gradient-to-r from-[#1e3a8a] to-[#1e40af]",
          inputArea: "bg-gradient-to-b from-[#1f2937] to-[#374151]",
          inputField: "bg-[#111827]",
          button: "bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#6366f1] hover:to-[#8b5cf6]",
          divider: "bg-[#6366f1]",
          userAvatar: "bg-gradient-to-r from-[#6366f1] to-[#a5b4fc]",
          aiAvatar: "bg-gradient-to-r from-[#1e40af] to-[#3b82f6]",
          sidebar: "bg-gradient-to-r from-[#111827] to-[#1f2937]",
          card: "bg-gradient-to-r from-[#1e3a8a]/90 to-[#1e40af]/90 border border-indigo-500/20",
          pageContainer: "bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#374151]",
          navItem: "text-indigo-200 hover:bg-indigo-900/30",
          navItemActive: "bg-indigo-800/50 text-white",
          modalBg: "bg-[#111827]/90 backdrop-blur-md",
          hoverEffect: "hover:bg-indigo-800/30"
        };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeStyles: getThemeStyles() }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
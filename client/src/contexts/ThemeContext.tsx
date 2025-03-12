import { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Define the structure of theme styles
type ThemeStyles = {
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
};

// Define the shape of the context
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themeStyles: ThemeStyles;
}

// Function to return theme styles based on the selected theme
const getThemeStyles = (theme: string): ThemeStyles => {
  switch (theme) {
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
        aiAvatar: "bg-gradient-to-r from-[#7209b7] to-[#560bad]"
      };
    case "cosmic":
      return {
        background: "bg-gradient-to-b from-[#03071e] via-[#240046] to-[#3a0ca3]",
        header: "bg-gradient-to-r from-[#3a0ca3] to-[#7209b7]",
        userMessage: "bg-gradient-to-r from-[#f72585] to-[#b5179e]",
        aiMessage: "bg-gradient-to-r from-[#3a0ca3] to-[#4361ee]",
        inputArea: "bg-gradient-to-b from-[#240046] to-[#3a0ca3]",
        inputField: "bg-[#03071e]",
        button: "bg-gradient-to-r from-[#f72585] to-[#7209b7] hover:from-[#b5179e] hover:to-[#560bad]",
        divider: "bg-[#4361ee]",
        userAvatar: "bg-gradient-to-r from-[#f72585] to-[#ff9e00]",
        aiAvatar: "bg-gradient-to-r from-[#4361ee] to-[#3a0ca3]"
      };
    case "night":
      return {
        background: "bg-gradient-to-b from-[#050a18] via-[#041833] to-[#04293a]",
        header: "bg-gradient-to-r from-[#04293a] to-[#064663]",
        userMessage: "bg-gradient-to-r from-[#0077b6] to-[#0096c7]",
        aiMessage: "bg-gradient-to-r from-[#064663] to-[#04293a]",
        inputArea: "bg-gradient-to-b from-[#041833] to-[#04293a]",
        inputField: "bg-[#050a18]",
        button: "bg-gradient-to-r from-[#0077b6] to-[#00b4d8] hover:from-[#0096c7] hover:to-[#48cae4]",
        divider: "bg-[#064663]",
        userAvatar: "bg-gradient-to-r from-[#0096c7] to-[#48cae4]",
        aiAvatar: "bg-gradient-to-r from-[#064663] to-[#0077b6]"
      };
    default:
      return getThemeStyles("purple");
  }
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "cosmic",
  setTheme: () => {},
  themeStyles: getThemeStyles("cosmic"),
});

// Define props type for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState("cosmic");
  const [themeStyles, setThemeStyles] = useState(getThemeStyles("cosmic"));

  useEffect(() => {
    setThemeStyles(getThemeStyles(theme));
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

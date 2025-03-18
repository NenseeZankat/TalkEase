import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { useTheme } from "../layout/ThemeProvider";
import axios from "axios";
import { createTheme, ThemeProvider, Box } from "@mui/material";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  
  // Handle email validation
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    console.log("Signing up with", name, email, password); // Added debugging like in Login

    setLoading(true);
    setError("");

    try {
      // Sending request to the API to register the user
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name,
        email,
        password,
        embedding: [],  // If you have an embedding, you can add it here
      });

      // Handle successful registration
      const { token, user } = response.data; // Changed to match login's structure

      // Login the user and store user data in localStorage (like in Login)
      login(token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/chat");  // Redirect to the chat page after successful signup

    } catch (err) {
      if (err.response) {
        console.log(err.response); // Added better error logging from Login
        setError(err.response.data.msg || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Signup Error:", err);
    }

    setLoading(false);
  };

  // Handle form submission on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const theme = createTheme({
    palette: {
      primary: { main: "#7c3aed" },
      secondary: { main: "#f43f5e" },
      background: { default: "#0f172a" },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
    },
  });
  const { themeStyles } = useTheme();

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", position: "relative", overflow: "hidden", color: "white" }}>
      <Box sx={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "linear-gradient(45deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))", top: "-100px", right: "-100px", zIndex: 0 }} />
      <Box sx={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "linear-gradient(45deg, rgba(244, 63, 94, 0.15), rgba(244, 63, 94, 0.05))", bottom: "-50px", left: "-50px", zIndex: 0 }} />

    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background canvas */}
      <canvas id="background-canvas" className="absolute top-0 left-0 w-full h-full -z-10"></canvas>

      {/* Signup form with glassmorphism effect */}
      <div className={`backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-gray-700/50 ${themeStyles.card}`}>
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className={`w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff] ${themeStyles.inputField ? themeStyles.inputField.replace('bg-[#', 'bg-opacity-70 bg-[#') : ''}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="email"
          placeholder="Email"
          className={`w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff] ${themeStyles.inputField ? themeStyles.inputField.replace('bg-[#', 'bg-opacity-70 bg-[#') : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password (min. 6 chars)"
            className={`w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff] ${themeStyles.inputField ? themeStyles.inputField.replace('bg-[#', 'bg-opacity-70 bg-[#') : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c77dff]"
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full text-white py-3 rounded-lg shadow-md transition-all disabled:opacity-70 ${themeStyles.button || 'bg-gradient-to-r from-[#ff007f] to-[#6a00f4] hover:from-[#d90429] hover:to-[#560bad]'}`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#c77dff] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    </Box>
    </ThemeProvider>

  );
};

export default Signup;

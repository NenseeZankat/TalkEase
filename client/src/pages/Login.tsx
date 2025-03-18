import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { useTheme } from "../layout/ThemeProvider";
import axios from "axios";
import { createTheme, ThemeProvider, Box } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const { login } = useContext(AuthContext);
  const { themeStyles } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/user/login", { email, password });
      const { token, user } = response.data;
      login(token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", position: "relative", overflow: "hidden", color: "white" }}>
        <Box sx={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "linear-gradient(45deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))", top: "-100px", right: "-100px", zIndex: 0 }} />
        <Box sx={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "linear-gradient(45deg, rgba(244, 63, 94, 0.15), rgba(244, 63, 94, 0.05))", bottom: "-50px", left: "-50px", zIndex: 0 }} />

        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <canvas id="background-canvas" className="absolute top-0 left-0 w-full h-full -z-10"></canvas>
          <div className={`backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-gray-700/50 ${themeStyles.card}`}>
            <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>
            {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
            <input type="email" placeholder="Email" className={`w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]`} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
            <input type="password" placeholder="Password" className={`w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]`} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            <button onClick={handleLogin} disabled={loading} className={`w-full text-white py-3 rounded-lg shadow-md transition-all disabled:opacity-70 bg-gradient-to-r from-[#ff007f] to-[#6a00f4] hover:from-[#d90429] hover:to-[#560bad]`}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-gray-400 mt-4">
              Don't have an account? <Link to="/signup" className="text-[#c77dff] hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default Login;

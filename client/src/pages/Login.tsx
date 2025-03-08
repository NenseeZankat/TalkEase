import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulating API request delay
      await new Promise((res) => setTimeout(res, 1000));

      // Mock authentication (replace with real auth logic)
      if (email === "test@example.com" && password === "password123") {
        navigate("/chat"); // Redirect to chat page on success
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f18]">
      <div className="bg-[#161b22] p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white py-3 rounded-lg shadow-md hover:from-[#d90429] hover:to-[#560bad] transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#c77dff] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

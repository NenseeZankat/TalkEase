import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulating API request delay
      await new Promise((res) => setTimeout(res, 1000));

      // Mock signup logic (replace with real API call)
      if (email.includes("@") && password.length >= 6) {
        // Create a token and use the login function from context
        login("mock-jwt-token");
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
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min. 6 chars)"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white py-3 rounded-lg shadow-md hover:from-[#d90429] hover:to-[#560bad] transition-all"
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
  );
};

export default Signup;
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App"; // Import the AuthContext
import axios from "axios"; 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get the login function from AuthContext
  const { login } = useContext(AuthContext);

  // Background animation effect
  useEffect(() => {
    // Create canvas for particle animation
    const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle properties
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        // Random color from the gradient palette
        const colors = ['#ff007f', '#c77dff', '#6a00f4', '#560bad'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Create particles
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(13, 15, 24, 1)');
      gradient.addColorStop(0.5, 'rgba(22, 27, 34, 1)');
      gradient.addColorStop(1, 'rgba(13, 15, 24, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
  
    console.log("Logging in with", email, password); // Debugging line
  
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });
  
      const { token, user } = response.data;
      login(token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/chat");
    } catch (err) {
      if (err.response) {
        console.log(err.response); // Debugging line to check error
        setError(err.response.data.msg || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  
    setLoading(false);
  };
  // Handle form submission on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background canvas */}
      <canvas id="background-canvas" className="absolute top-0 left-0 w-full h-full -z-10"></canvas>
      
      {/* Login form with glassmorphism effect */}
      <div className="bg-[#161b22]/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-gray-700/50">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-800/70 text-white focus:outline-none focus:ring-2 focus:ring-[#c77dff]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#ff007f] to-[#6a00f4] text-white py-3 rounded-lg shadow-md hover:from-[#d90429] hover:to-[#560bad] transition-all disabled:opacity-70"
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
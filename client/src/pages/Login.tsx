import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-3 mb-4 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-3 mb-4 border rounded" />
        <button className="w-full bg-green-500 text-white py-3 rounded">Login</button>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <input type="text" placeholder="Name" className="w-full p-3 mb-4 border rounded" />
        <input type="email" placeholder="Email" className="w-full p-3 mb-4 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-3 mb-4 border rounded" />
        <button className="w-full bg-blue-500 text-white py-3 rounded">Sign Up</button>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

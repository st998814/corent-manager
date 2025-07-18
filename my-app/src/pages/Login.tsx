import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage = ({ setIsLoggedIn }: LoginProps) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  // Mock user data for demonstration purposes
  const mockUser = { email: "demo@test.com", password: "123456" };

  const handleLogin = (data: { email: string; password: string }) => {
    if (data.email === mockUser.email && data.password === mockUser.password) {
      setIsLoggedIn(true);
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    handleLogin(formData);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Sign in to your account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-3 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-3 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button onClick={() => handleLogin({ email: "", password: "" })}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Demo credentials: demo@test.com / 123456
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
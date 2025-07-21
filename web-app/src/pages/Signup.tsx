import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// Signup component
// This component will handle user registration
const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", { name,email, password });
      alert(res.data.message);
      navigate("/login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear previous error
        handleSignup(formData.name, formData.email, formData.password); // Call the signup function with form data
  };

  return (
     <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Signup
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-300">
                Name
                </label>
                <input
                type="text"
                id="name"
                className="mt-1 w-full px-3 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                />
          </div>
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

          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

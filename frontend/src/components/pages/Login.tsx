"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../../services/auth"; 
import { useAuthStore } from "../../stores/authStore"; 

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

const setUser = useAuthStore((state) => state.setUser); 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
const res = await loginUser({username, password, email: ""});
      setUser(res.user); 
        
      // Redirect or show success message
      window.location.href = "/profile";

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tyson-login relative p-4">
         <img src={"/login-tyson.jpg"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />
     

      {/* Card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-[#67676732] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Welcome Back
        </h2>
        <p className="text-gray-300 text-center mb-8">Login to rage</p>

        <form className="space-y-6" onSubmit={handleLogin}>
          <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </motion.div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl py-3 text-lg font-semibold text-white shadow-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-red-400 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}

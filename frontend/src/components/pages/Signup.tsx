"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser } from "../../services/auth";
import { useAuthStore } from "../../stores/authStore";
import paperTexx from "../../../public/paper-texture.webp";
export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [streakReward, setStreakReward] = useState<{ xpGained: number; levelGained: number } | null>(null);

  const setUser = useAuthStore((state) => state.setUser);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // call backend
      const res = await registerUser({ email, username, password });
      setUser(res.user);

      if (res.streakReward) {
        setStreakReward(res.streakReward);
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      } else {
        window.location.href = "/profile";
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex justify-center items-center relative">
   
      <img
        src={"/signup-tyson.png"}
        className="absolute grayscale-100 h-full opacity-80 w-full"
        alt=""
      />
      <div className="flex  w-full items-center justify-center relative p-4 pt-20">
        {/* Card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className=" w-full max-w-xl bg-[#42424273] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40"
        >
          <h2 className="text-3xl font-bold text-center text-white">
            Create Account
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Join us and get fighting
          </p>

          <form className="space-y-6 " onSubmit={handleSignup}>
            {/* Username*/}
            <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </motion.div>

            {/* Password */}
            <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </motion.div>

            {/* Confirm Password */}
            <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </motion.div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full text-center font-bold bg-gradient-to-r from-[#fd5353] to-red-600 text-white hover:bg-black flex items-center justify-center  gap-2 disabled:opacity-50 rounded-xl py-3 text-lg shadow-md transition"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-gray-300 text-sm text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-red-400 hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </div>

      {/* Streak Reward Toast */}
      <AnimatePresence>
        {streakReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            transition={{ type: "spring", stiffness: 500, damping: 22, mass: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none"
          >
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] px-5 py-2.5 rounded-lg border border-[#dc2626]/40 shadow-[0_0_25px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <motion.span
                  animate={{ rotate: [0, -15, 0, 15, 0] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-lg"
                >
                  🔥
                </motion.span>
                <span className="font-black text-lg tracking-wide text-white/90">
                  <span className="text-[#dc2626] mr-1">+</span>
                  {streakReward.xpGained}
                  <span className="ml-1.5 text-xs font-semibold text-[#dc2626]/80 tracking-[0.15em] uppercase">XP</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 animate-shimmer" />
              </div>
            </motion.div>

            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] px-5 py-2.5 rounded-lg border border-[#dc2626]/40 shadow-[0_0_25px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <motion.span
                  animate={{ rotate: [0, -15, 0, 15, 0] }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="text-lg"
                >
                  🏆
                </motion.span>
                <span className="font-black text-lg tracking-wide text-white/90">
                  <span className="text-[#dc2626] mr-1">+</span>
                  {streakReward.levelGained.toFixed(2)}
                  <span className="ml-1.5 text-xs font-semibold text-[#dc2626]/80 tracking-[0.15em] uppercase">Level</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 animate-shimmer" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

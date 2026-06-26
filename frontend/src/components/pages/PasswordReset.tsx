"use client";

import { useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { resetPassword } from "../../services/auth";

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log("[PasswordReset] token from URL:", token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tyson-login relative p-4">
        <img src={"/login-tyson.jpg"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#67676732] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Password Reset</h2>
          <p className="text-green-400 text-lg">Password reset successful!</p>
          <p className="text-gray-300 text-sm mt-2">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tyson-login relative p-4">
      <img src={"/login-tyson.jpg"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md bg-[#67676732] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center text-white">Reset Password</h2>
        <p className="text-gray-300 text-center mb-8">Enter your new password</p>

        <form className="space-y-6" onSubmit={handleReset}>
          <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
            <input
              type="password"
              placeholder="New Password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </motion.div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full font-bold bg-gradient-to-r from-[#fd5353] to-red-600 hover:bg-black flex items-center justify-center gap-2 disabled:opacity-50 rounded-xl py-3 text-lg text-white shadow-md transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          <a href="/login" className="text-red-400 hover:underline">Back to Login</a>
        </p>
      </motion.div>
    </div>
  );
}

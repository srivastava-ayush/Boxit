"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { forgotPassword } from "../../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tyson-login relative p-4">
      <img src={"/login-tyson.jpg"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md bg-[#67676732] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40"
      >
        {sent ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Check your email</h2>
            <p className="text-gray-300">
              If an account exists for <strong className="text-white">{email}</strong>, you'll receive a magic link to reset your password.
            </p>
            <a href="/login" className="inline-block mt-6 text-red-400 hover:underline">Back to Login</a>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-white">Forgot Password</h2>
            <p className="text-gray-300 text-center mb-8">Enter your email to receive a magic link</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div whileFocus={{ scale: 1.02 }} className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Sending..." : "Send Magic Link"}
              </motion.button>
            </form>

            <p className="text-gray-300 text-sm text-center mt-6">
              <a href="/login" className="text-red-400 hover:underline">Back to Login</a>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

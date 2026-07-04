"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser, resendVerification } from "../../services/auth";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState<string | null>(null);

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
      await registerUser({ email, username, password });
      setSubmittedEmail(email);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    setResending(true);
    setResentMsg(null);
    try {
      await resendVerification({ email: submittedEmail });
      setResentMsg("Verification email resent!");
    } catch (err: any) {
      setResentMsg(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="min-h-screen flex justify-center items-center relative">
        <img src={"/signup-tyson.png"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />
        <div className="flex w-full items-center justify-center relative p-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl bg-[#42424273] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Check Your Email</h2>
           
           <div>
             <p className="text-gray-300 mb-2">
              We sent a verification link to
            </p>
            <p className="text-white font-medium mb-2">{submittedEmail}</p>
            <p className="text-gray-300 text-sm mb-8">
              Click the link in the email to activate your account. Then log in to start training.
            </p>
            </div>
            <p className="text-red-300 font-black">If you don't see the email, check your spam folder.</p>

            {resentMsg && <p className="text-sm mb-4 text-amber-400">{resentMsg}</p>}

            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-gray-400 underline  hover:text-red-400 transition mb-4 block w-full"
            >
              {resending ? "Sending..." : "Resend verification email"}
            </button>

            <a href="/login" className="inline-block font-bold bg-gradient-to-r from-[#fd5353] to-red-600 text-white rounded-xl py-3 px-8 shadow-md transition hover:scale-105">
              Go to Login
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex justify-center items-center relative">
      <img src={"/signup-tyson.png"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />
      <div className="flex  w-full items-center justify-center relative p-4 pt-20">
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
    </div>
  );
}

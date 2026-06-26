"use client";

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { verifyEmail } from "../../services/auth";
import { useAuthStore } from "../../stores/authStore";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage("Email verified successfully!");

        if (res.user) {
          useAuthStore.getState().setUser(res.user);
        }

        setTimeout(() => {
          window.location.href = "/profile";
        }, 2000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-tyson-login relative p-4">
      <img src={"/login-tyson.jpg"} className="absolute grayscale-100 h-full opacity-80 w-full" alt="" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#67676732] backdrop-blur-xl rounded-2xl shadow-xl shadow-[#ffffff06] p-8 border border-white/40 text-center"
      >
        {status === "loading" && (
          <>
            <h2 className="text-3xl font-bold text-white mb-4">Verifying...</h2>
            <p className="text-gray-300">Please wait while we verify your email.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-3xl font-bold text-green-400 mb-4">Email Verified!</h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <Link to="/profile" className="text-red-400 hover:underline">Go to Profile</Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-3xl font-bold text-red-400 mb-4">Verification Failed</h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <Link to="/" className="text-red-400 hover:underline">Back to Home</Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

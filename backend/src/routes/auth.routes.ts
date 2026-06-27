import express from "express";
import { forgotPassword, loginUser, logoutUser, registerUser, resendVerification, resetPassword, returnUser, testEmail, verifyEmail } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
const authRouter=  express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.get("/me", protect, returnUser);
authRouter.post("/logout", protect, logoutUser);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/test-email", testEmail);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/verify-email/:token", verifyEmail);
export default authRouter;
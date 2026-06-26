import express from "express";
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword, returnUser, verifyEmail } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
const authRouter=  express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.get("/me", protect, returnUser);
authRouter.post("/logout", protect, logoutUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/verify-email/:token", verifyEmail);
export default authRouter;
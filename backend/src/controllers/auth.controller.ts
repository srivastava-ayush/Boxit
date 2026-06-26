import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";
import { sendResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../utils/email";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    xp: number;
    level: number;
    streak: number;
    achievements: string[];
  };
}

// 🔐 Generate JWT
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username taken" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    let user = await User.create({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    user.updateStreak();
    user.addXP(50);

    await user.save({ validateBeforeSave: false });

    sendVerificationEmail(email, verificationToken).catch((err) =>
      console.error("[AUTH] Background verification email failed:", err)
    );
    sendWelcomeEmail(email, username).catch((err) =>
      console.error("[AUTH] Background welcome email failed:", err)
    );

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "User created ✅ Please verify your email",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        achievements: user.achievements,
        isVerified: user.isVerified,
      },
      streakReward: { xpGained: 50 },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select(
      "+password +email +username +lastLogin +xp +level +streak +achievements"
    );
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const prevLastLogin = user.lastLogin;
    user.updateStreak();

    const isNewDayLogin = !prevLastLogin || !user.lastLogin || prevLastLogin.getTime() !== user.lastLogin.getTime();

    let streakReward = null;
    if (isNewDayLogin) {
      const streakXp = 50;
      user.addXP(streakXp);
      streakReward = { xpGained: streakXp };
    }

    await user.save({ validateBeforeSave: false });

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Login successful ✅",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        achievements: user.achievements,
      },
      streakReward,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.json({ success: true, message: "Logged out ✅" });
};

export const returnUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // req.user is attached by the protect middleware
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account with that email" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    sendResetEmail(email, token).catch((err) =>
      console.error("[AUTH] Background reset email failed:", err)
    );

    res.json({ success: true, message: "Magic link sent to your email" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


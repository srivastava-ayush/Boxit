import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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

    let user = await User.create({ username, email, password });

    user.updateStreak();
    user.addXP(50);

    await user.save({ validateBeforeSave: false });

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
      message: "User created ✅",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        achievements: user.achievements,
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


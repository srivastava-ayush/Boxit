import express, { Request } from "express";
import { protect } from "../middlewares/auth.middleware";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

const workoutRouter = express.Router();

workoutRouter.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { combo, reps } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const xpGained = reps * 2;
    const levelGained = 0.05;
    user.addXP(xpGained);
    user.level += levelGained;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Workout complete!",
      xpGained,
      levelGained,
      xp: user.xp,
      level: user.level,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default workoutRouter;

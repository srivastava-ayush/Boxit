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
    const oldLevel = user.level;
    const xpGained = reps * 2;
    
    user.addXP(xpGained);
    
    await user.save({ validateBeforeSave: false });

   if( user.level > oldLevel) {

    res.json({
      success: true,
      message: "Workout complete! Level up!",
      xpGained,
      xp: user.xp,
      isNewLevel: true,
      level: user.level,
    })
   }
   else { res.json({
      success: true,
      message: "Workout complete!",
      xpGained,
      xp: user.xp,
      level: user.level,
      isNewLevel: false,
    });}


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default workoutRouter;

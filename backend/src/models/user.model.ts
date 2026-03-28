import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  xp: number;
  level: number;
  streak: number;
  lastLogin?: Date;
  achievements: string[];
  matchPassword(enteredPassword: string): Promise<boolean>;
  addXP(amount: number): void;
  updateStreak(): void;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    maxlength: 100,
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastLogin: Date,
  achievements: [String],
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.addXP = function (amount: number) {
  this.xp += amount;

  const requiredXP = this.level * 100;
  if (this.xp >= requiredXP) {
    this.level++;
    this.xp -= requiredXP;
  }
};



userSchema.methods.updateStreak = function () {
  const now = new Date();
  const last = this.lastLogin ? new Date(this.lastLogin) : null;
console.log("Last login:", this.lastLogin);

  if (typeof this.streak !== "number") this.streak = 0;

  // No last login → first login
  if (!last) {
    this.streak = 1;
    this.lastLogin = now;
    return;
  }

  // Use LOCAL date parts instead of UTC ones
  const startOfToday:any = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfLastLogin: any = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  const diffDays = Math.floor(
    (startOfToday - startOfLastLogin) / (1000 * 60 * 60 * 24)
  );
 console.log("Difference in days:", diffDays);
  if (diffDays === 0) {
  
    return;
  }     // same day → no increment
  else if (diffDays === 1) this.streak++; // next day → streak++
  else this.streak = 1;            // missed days → reset

  this.lastLogin = now;
};






const User = mongoose.model<IUser>("User", userSchema);
export default User;
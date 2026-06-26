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
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
  console.log(`Adding ${amount} XP to user ${this.username}`);
  this.xp += amount;

  console.log(`User ${this.username} now has ${this.xp} XP and is at level ${this.level}`);


  while (this.xp >= this.level * 100) {
    console.log(`User ${this.username} has enough XP to level up!`);
    this.xp -= this.level * 100;
    console.log(` current lvl: ${this.level}`);
    this.level++;
    console.log(` new lvl: ${this.level}`);
  }
};
userSchema.methods.updateStreak = function () {
  const nowUTC = new Date();
  const lastUTC = this.lastLogin ? new Date(this.lastLogin) : null;

  if (typeof this.streak !== "number") this.streak = 0;

  if (!lastUTC) {
    this.streak = 1;
    this.lastLogin = nowUTC;
    return;
  }

  const isSameDay =
    nowUTC.getUTCFullYear() === lastUTC.getUTCFullYear() &&
    nowUTC.getUTCMonth() === lastUTC.getUTCMonth() &&
    nowUTC.getUTCDate() === lastUTC.getUTCDate();

  if (isSameDay) {
    return;
  }

  const diffDays = Math.floor(
    (nowUTC.getTime() - lastUTC.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    this.streak++;
  } else {
    this.streak = 1;
  }

  this.lastLogin = nowUTC;
};






const User = mongoose.model<IUser>("User", userSchema);
export default User;
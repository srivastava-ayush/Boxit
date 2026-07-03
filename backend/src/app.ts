import express from "express";
import cors from "cors";
import connectDB from "./configs/db";
import authRoutes from "./routes/auth.routes";
import workoutRoutes from "./routes/workout.routes";
import cookieParser from "cookie-parser";


connectDB();

const app = express();

const allowedOrigins = [
  //  "http://localhost:5173",
  "https://boxlit.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile apps / curl

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/workouts", workoutRoutes);

export default app;

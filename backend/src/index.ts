import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("[ENV] SMTP_HOST:", process.env.SMTP_HOST);
  console.log("[ENV] SMTP_USER:", process.env.SMTP_USER ? "set" : "NOT SET");
  console.log("[ENV] SMTP_PASS:", process.env.SMTP_PASS ? "set" : "NOT SET");
  console.log("[ENV] FRONTEND_URL:", process.env.FRONTEND_URL);
});

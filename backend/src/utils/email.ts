import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection on server startup
(async () => {
  try {
    await transporter.verify();

    console.log("✅ SMTP Connected");
  } catch (err) {
    console.error("❌ SMTP Connection Failed");
    console.error(err);
  }
})();

const FROM = `"Boxlit" <${process.env.SMTP_FROM}>`;

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Verify your Boxlit email",
      html: `
        <h2>Welcome to Boxlit 👋</h2>

        <p>Please verify your email by clicking the button below.</p>

        <a href="${verifyUrl}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#6C63FF;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
          ">
          Verify Email
        </a>

        <p>This link expires in 24 hours.</p>

        <p>If you didn't create an account, you can ignore this email.</p>
      `,
    });

    console.log("✅ Verification email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Verification Email Error");
    console.error(err);
  }
};

export const sendWelcomeEmail = async (
  email: string,
  username: string
) => {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Welcome to Boxlit 🎉",
      html: `
        <h2>Welcome ${username}! 🥊</h2>

        <p>Your account is ready.</p>

        <p>
          Start training, earn XP, maintain your streak,
          and become a better boxer every day.
        </p>

        <p>See you inside!</p>

        <strong>— Team Boxlit</strong>
      `,
    });

    console.log("✅ Welcome email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Welcome Email Error");
    console.error(err);
  }
};

export const sendResetEmail = async (
  email: string,
  token: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Reset your Boxlit password",
      html: `
        <p>You requested a password reset.</p>

        <a href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#6C63FF;
            color:white;
            text-decoration:none;
            border-radius:8px;
          ">
          Reset Password
        </a>

        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("✅ Password reset email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Reset Email Error");
    console.error(err);
  }
};
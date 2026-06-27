import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "74.125.142.108",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as any);

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log(`[EMAIL] Sending password reset to ${email} with token ${token} → ${resetUrl}`);

  try {
    await transporter.sendMail({
      from: `"Boxlit" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your Boxlit password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the magic link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6C63FF;color:#fff;text-decoration:none;border-radius:6px">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
    console.log(`[EMAIL] Password reset sent to ${email}`);
  } catch (err) {
    console.error(`[EMAIL] Failed to send reset email to ${email}:`, err);
  }
};

export const sendWelcomeEmail = async (email: string, username: string) => {
  console.log(`[EMAIL] Sending welcome to ${username} <${email}>`);

  try {
    await transporter.sendMail({
      from: `"Boxlit" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Boxlit!",
      html: `
        <p>Hey ${username},</p>
        <p>Welcome to <strong>Boxlit</strong>! You're all set to start tracking your workouts and leveling up.</p>
        <p>Every workout earns you XP — keep your streak alive to earn even more. Let's go! 💪</p>
        <p style="margin-top:24px">— The Boxlit Team</p>
      `,
    });
    console.log(`[EMAIL] Welcome sent to ${email}`);
  } catch (err) {
    console.error(`[EMAIL] Failed to send welcome to ${email}:`, err);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log(`[EMAIL] Sending verification to ${email} with token ${token} → ${verifyUrl}`);

  try {
    await transporter.sendMail({
      from: `"Boxlit" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your Boxlit email",
      html: `
        <p>Welcome to Boxlit!</p>
        <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6C63FF;color:#fff;text-decoration:none;border-radius:6px">Verify Email</a>
        <p>If you didn't create an account, ignore this email.</p>
      `,
    });
    console.log(`[EMAIL] Verification sent to ${email}`);
  } catch (err) {
    console.error(`[EMAIL] Failed to send verification to ${email}:`, err);
  }
};

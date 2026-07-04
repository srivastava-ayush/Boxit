import https from "https";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  retries = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: {
        name: process.env.SMTP_FROM_NAME || "Boxlit",
        email: process.env.SMTP_FROM!,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    });

    const url = new URL(BREVO_API_URL);
    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      family: 4,
      timeout: 30000,
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode! >= 200 && res.statusCode! < 300) {
          resolve();
        } else {
          reject(new Error(`Brevo API error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Brevo API timeout"));
    });

    req.write(data);
    req.end();
  });
}

async function sendEmailWithRetry(
  to: string,
  subject: string,
  htmlContent: string
) {
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      await sendEmail(to, subject, htmlContent);
      return;
    } catch (err) {
      if (attempt < 2) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`⚠️ Email send attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    await sendEmailWithRetry(
      email,
      "Verify your Boxlit email",
      `
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
      `
    );

    console.log("✅ Verification email sent via Brevo");
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
    await sendEmailWithRetry(
      email,
      "Welcome to Boxlit 🎉",
      `
        <h2>Welcome ${username}! 🥊</h2>

        <p>Your account is ready.</p>

        <p>
          Start training, earn XP, maintain your streak,
          and become a better boxer every day.
        </p>

        <p>See you inside!</p>

        <strong>— Team Boxlit</strong>
      `
    );

    console.log("✅ Welcome email sent via Brevo");
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
    await sendEmailWithRetry(
      email,
      "Reset your Boxlit password",
      `
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
      `
    );

    console.log("✅ Password reset email sent via Brevo");
  } catch (err) {
    console.error("❌ Reset Email Error");
    console.error(err);
  }
};

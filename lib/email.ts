import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetUrl: string
) {
  const storeName = process.env.STORE_NAME || "Streexpo";

  await transporter.sendMail({
    from: `"${storeName}" <${process.env.BREVO_SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Reset your ${storeName} password`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <div style="background:#0a192f;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:0.1em;text-transform:uppercase;">${storeName}</h1>
            </div>
            <div style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#09090b;font-size:20px;">Reset your password</h2>
              <p style="margin:0 0 24px;color:#71717a;font-size:14px;">Hi ${toName}, we received a request to reset your password. Click the button below to choose a new one.</p>
              <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:0.05em;text-transform:uppercase;">Reset Password</a>
              <p style="margin:24px 0 0;color:#a1a1aa;font-size:12px;">This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.</p>
              <hr style="border:none;border-top:1px solid #f4f4f5;margin:32px 0;" />
              <p style="margin:0;color:#a1a1aa;font-size:11px;">You're receiving this email because a password reset was requested for your ${storeName} account (${toEmail}).</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

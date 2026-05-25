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

const storeName = process.env.STORE_NAME || "Streexpo";

// Password Reset Email
export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetUrl: string
) {
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

// Order Confirmation Email
export async function sendOrderConfirmationEmail(
  toEmail: string,
  toName: string,
  orderId: string,
  totalAmount: number,
  items: Array<{ name: string; quantity: number; price: number }>
) {
  // Generate a clean HTML list of items ordered
  const itemsListHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; color: #3f3f46; font-size: 14px;">${item.name} (x${item.quantity})</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f4f4f5; color: #09090b; font-size: 14px; text-align: right; font-weight: 600;">৳${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  await transporter.sendMail({
    from: `"${storeName}" <${process.env.BREVO_SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Thank you for your order! - #${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <div style="background:#0a192f;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:0.1em;text-transform:uppercase;">${storeName}</h1>
            </div>
            <div style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#09090b;font-size:20px;">Order Confirmed!</h2>
              <p style="margin:0 0 24px;color:#71717a;font-size:14px;">Thank you for your purchase, ${toName}. We're getting your order ready to ship.</p>
              
              <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #71717a;">Order ID: <strong style="color: #09090b;">#${orderId}</strong></p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px; color: #71717a; font-size: 12px; text-transform: uppercase;">Item</th>
                    <th style="text-align: right; padding-bottom: 8px; color: #71717a; font-size: 12px; text-transform: uppercase;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                  <tr>
                    <td style="padding: 16px 0 0; color: #09090b; font-size: 16px; font-weight: 700;">Total Paid</td>
                    <td style="padding: 16px 0 0; color: #2563eb; font-size: 18px; font-weight: 700; text-align: right;">৳ ${totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <hr style="border:none;border-top:1px solid #f4f4f5;margin:32px 0;" />
              <p style="margin:0;color:#a1a1aa;font-size:11px;">If you have any questions about your order, reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
// 3. NEW LOGIC: Order Cancellation Email
export async function sendOrderCancellationEmail(
  toEmail: string,
  toName: string,
  orderId: string,
  totalAmount: number
) {
  await transporter.sendMail({
    from: `"${storeName}" <${process.env.BREVO_SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Order Cancelled - #${orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <div style="background:#ef4444;padding:32px 40px;"> <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:0.1em;text-transform:uppercase;">${storeName}</h1>
            </div>
            <div style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#09090b;font-size:20px;">Order #\${orderId} Cancelled</h2>
              <p style="margin:0 0 24px;color:#71717a;font-size:14px;">Hi ${toName},</p>
              <p style="margin:0 0 24px;color:#3f3f46;font-size:14px;line-height:1.6;">
                Your order <strong style="color:#09090b;">#${orderId}</strong> has been cancelled. If you have already made a payment or have questions regarding refunds, our team will get in touch with you shortly.
              </p>
              
              <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #71717a;">Total Amount Refonned/Cancelled: <strong style="color: #ef4444;">$${totalAmount.toFixed(2)}</strong></p>
              </div>

              <hr style="border:none;border-top:1px solid #f4f4f5;margin:32px 0;" />
              <p style="margin:0;color:#a1a1aa;font-size:11px;">If you believe this was done in error, please reply directly to this email or contact our customer support.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Forgot password error:", message);
    return NextResponse.json({ error: `Failed to process request: ${message}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpiry");

    if (!user) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}

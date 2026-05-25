import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Invalid request. Password must be at least 6 characters." }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("+password");

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}

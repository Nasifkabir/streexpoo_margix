import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// Lightweight endpoint to check account status before attempting sign-in.
// This is needed because NextAuth v4 sanitizes error messages from authorize(),
// so "BANNED" errors cannot be detected reliably on the client via res.error.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ status: "OK" });
    }

    await connectToDatabase();
    const user = await User.findOne({ email }).select("status").lean() as { status?: string } | null;

    if (user?.status === "BANNED") {
      return NextResponse.json({ status: "BANNED" });
    }

    return NextResponse.json({ status: "OK" });
  } catch {
    // On any error, allow NextAuth to handle it normally
    return NextResponse.json({ status: "OK" });
  }
}

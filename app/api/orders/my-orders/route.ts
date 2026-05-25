import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

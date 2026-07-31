import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const users = await User.find().sort({ createdAt: -1 }).lean();

    // Attach order analytics to each user
    const usersWithAnalytics = await Promise.all(
      users.map(async (user) => {
        const userOrders = await Order.find({ customerEmail: user.email }).lean();
        
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
          ...user,
          totalOrders,
          totalSpent,
        };
      })
    );

    return NextResponse.json(usersWithAnalytics);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

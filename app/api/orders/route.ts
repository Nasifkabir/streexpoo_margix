import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, customerAddress, items, totalAmount } = body;

    if (!customerName || !customerPhone || !customerEmail || !customerAddress || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a clean Order ID (e.g., STX-12345)
    const orderId = `STX-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await Order.create({
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      totalAmount,
      status: "PENDING",
    });

    // Optionally: Reduce stock (uncomment if you want automatic stock reduction on order)
    /*
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity }
      });
    }
    */

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.productId");
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

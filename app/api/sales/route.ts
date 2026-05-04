import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Sale from "@/models/Sale";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // If STAFF, only fetch their sales for today. If ADMIN, fetch all.
    const query: any = {};
    if (session.user.role === "STAFF") {
      query.soldBy = session.user.id;
      
      // Get today's start and end date
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const sales = await Sale.find(query)
      .populate("productId", "name category")
      .sort({ createdAt: -1 });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantitySold, sellingPrice } = body;

    if (!productId || !quantitySold || sellingPrice === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stockQuantity < quantitySold) {
      return NextResponse.json(
        { error: "Insufficient stock quantity" },
        { status: 400 }
      );
    }

    const totalAmount = quantitySold * sellingPrice;
    const profitMargin = (sellingPrice - product.purchaseRate) * quantitySold;

    const sale = new Sale({
      productId,
      quantitySold,
      sellingPrice,
      totalAmount,
      profitMargin,
      soldBy: session.user.id,
    });

    // Deduct from stock
    product.stockQuantity -= quantitySold;

    // Use a transaction in production, but save sequential here for simplicity
    await product.save();
    await sale.save();

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
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

    // Fetch all sales for Admin
    const query: any = {};

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantitySold, sellingPrice, variant } = body;

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

    // Check stock based on variant if provided, otherwise check main stock
    if (variant && variant.size) {
      const variantInDb = product.variants.find(
        (v: any) => v.size === variant.size
      );

      if (!variantInDb) {
        return NextResponse.json(
          { error: `Variant ${variant.size} not found` },
          { status: 404 }
        );
      }

      if (variantInDb.stockQuantity < quantitySold) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.size}` },
          { status: 400 }
        );
      }

      // Deduct from variant stock
      variantInDb.stockQuantity -= quantitySold;
    } else {
      if (product.stockQuantity < quantitySold) {
        return NextResponse.json(
          { error: "Insufficient total stock quantity" },
          { status: 400 }
        );
      }
    }

    // Always deduct from main stock for total tracking
    product.stockQuantity -= quantitySold;

    const totalAmount = quantitySold * sellingPrice;
    const profitMargin = (sellingPrice - product.purchaseRate) * quantitySold;

    const sale = new Sale({
      productId,
      variant, // Store variant info in sale record
      quantitySold,
      sellingPrice,
      totalAmount,
      profitMargin,
      soldBy: session.user.id,
    });

    // Save updates
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

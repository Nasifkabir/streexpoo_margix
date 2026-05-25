import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Sale from "@/models/Sale";
import { sendOrderConfirmationEmail, sendOrderCancellationEmail } from "@/lib/email"; // 1. Import your email helpers

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { status } = await req.json();
    const { id: orderId } = await params;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const oldStatus = order.status;

    // Logic for transitioning to CONFIRMED
    if (status === "CONFIRMED" && oldStatus === "PENDING") {
      // 1. Reduce Stock and 2. Create Sale records
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          // Check stock one last time
          if (product.stockQuantity < item.quantity) {
            return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
          }

          // Reduce Product Stock
          product.stockQuantity -= item.quantity;
          await product.save();

          // Calculate margin for this item
          const itemTotal = item.price * item.quantity;
          const itemMargin = (item.price - product.purchaseRate) * item.quantity;

          // Create Sale Record for Analytics/Margin
          await Sale.create({
            productId: item.productId,
            quantitySold: item.quantity,
            sellingPrice: item.price,
            totalAmount: itemTotal,
            profitMargin: itemMargin,
            date: new Date(),
          });
        }
      }

      // 2. TRIGGER CONFIRMATION EMAIL
      try {
        await sendOrderConfirmationEmail(
          order.customerEmail,
          order.customerName,
          order.orderId,
          order.totalAmount,
          order.items
        );
      } catch (emailError) {
        console.error("Confirmation email failed to send:", emailError);
      }
    }

    // Logic for transitioning to CANCELLED from a state that already reduced stock
    if (status === "CANCELLED" && (oldStatus === "CONFIRMED" || oldStatus === "SHIPPED")) {
      // Return stock to inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: item.quantity }
        });

        // Note: In a real app, you might also want to "void" the Sale records
        // For simplicity here, we assume the margin impact is handled by confirmed sales only
      }

      // 3. TRIGGER CANCELLATION EMAIL
      try {
        await sendOrderCancellationEmail(
          order.customerEmail,
          order.customerName,
          order.orderId,
          order.totalAmount
        );
      } catch (emailError) {
        console.error("Cancellation email failed to send:", emailError);
      }
    }

    // Update the order status
    order.status = status;
    await order.save();

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
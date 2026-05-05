import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/db";
import StoreSettings from "@/models/StoreSettings";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    // We only expect one settings document
    let settings = await StoreSettings.findOne({});
    
    // If it doesn't exist, create a default one
    if (!settings) {
      settings = await StoreSettings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    let settings = await StoreSettings.findOne({});
    
    if (settings) {
      settings = await StoreSettings.findByIdAndUpdate(settings._id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      settings = await StoreSettings.create(body);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

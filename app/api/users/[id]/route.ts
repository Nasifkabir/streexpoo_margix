import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const ACCOUNT_STATUSES = new Set(["ACTIVE", "BANNED"]);

function unauthorizedResponse(session: Awaited<ReturnType<typeof getServerSession>>) {
  if (!session) {
    return NextResponse.json(
      { error: "Your session has expired. Please sign in again." },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { error: "Admin access is required." },
    { status: 403 }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse(session);
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, status } = body;

    await connectToDatabase();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (status !== undefined) {
      if (!ACCOUNT_STATUSES.has(status)) {
        return NextResponse.json(
          { error: "Invalid account status." },
          { status: 400 }
        );
      }

      // Admins are the only users who can reverse a ban. Allowing an admin
      // account to be banned can lock the entire dashboard out permanently.
      if (user.role === "ADMIN" && status === "BANNED") {
        return NextResponse.json(
          { error: "Admin accounts cannot be banned." },
          { status: 409 }
        );
      }

      user.status = status;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return unauthorizedResponse(session);
    }

    const { id } = await params;

    await connectToDatabase();

    const user = await User.findById(id).select("role");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted." },
        { status: 409 }
      );
    }

    await user.deleteOne();

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    console.log("[Debug] Users in database:", users.length);
    users.forEach((u: any) => {
      console.log(`  - ${u.email} (${u.role})`);
    });

    return NextResponse.json({
      count: users.length,
      users,
      dbUri: (process.env.MONGODB_URI || "").replace(/\/\/.*@/, "//<credentials>@"),
    });
  } catch (err: any) {
    console.error("[Debug] Failed to fetch users:", err.message);
    return NextResponse.json(
      {
        error: err.message,
        hint: "Make sure MongoDB is running. Run 'mongod' or start your MongoDB service.",
      },
      { status: 500 }
    );
  }
}

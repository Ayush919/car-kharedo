import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CarRequest from "@/models/CarRequest";

// GET: Fetch a single car request by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const carRequest = await CarRequest.findById(id)
    .populate("userId", "name email city")
    .lean();

  if (!carRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  return NextResponse.json(carRequest);
}

// PUT: Update a car request (status, etc.)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const carRequest = await CarRequest.findByIdAndUpdate(id, body, {
    new: true,
  })
    .populate("userId", "name email city")
    .lean();

  if (!carRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  return NextResponse.json(carRequest);
}

// DELETE: Remove a car request
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await CarRequest.findByIdAndDelete(id);
  return NextResponse.json({ message: "Request deleted" });
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Car from "@/models/Car";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const car = await Car.findById(params.id).lean();
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json(car);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const car = await Car.findByIdAndUpdate(params.id, body, { new: true }).lean();
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json(car);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const car = await Car.findByIdAndDelete(params.id);
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Car deleted successfully" });
}

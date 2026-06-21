import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Car from "@/models/Car";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } } // Changed to slug
) {
  await connectDB();
  const car = await Car.findOne({ slug: params.slug }).lean(); // Query by slug
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json(car);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } } // Changed to slug
) {
  await connectDB();
  const body = await req.json();
  // First, find the current car by slug so we can reference its _id when checking slug uniqueness
  const currentCar = await Car.findOne({ slug: params.slug }).lean();
  if (!currentCar) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  // Optionally, if title is updated, regenerate slug
  if (body.title) {
    // Helper function to generate a slug (copied from create route)
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    };

    let baseSlug = generateSlug(body.title);
    let newSlug = baseSlug;
    let counter = 0;
    // Ensure uniqueness excluding current car (use a safe any-cast for currentCar._id to satisfy TS)
    while (await Car.findOne({ slug: newSlug, _id: { $ne: (currentCar as any)._id } })) {
      counter++;
      newSlug = `${baseSlug}-${counter}`;
    }
    body.slug = newSlug;
  }

  const updated = await Car.findOneAndUpdate({ slug: params.slug }, body, { new: true }).lean(); // Find and update by slug
  if (!updated) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } } // Changed to slug
) {
  await connectDB();
  const car = await Car.findOneAndDelete({ slug: params.slug }); // Find and delete by slug
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Car deleted successfully" });
}

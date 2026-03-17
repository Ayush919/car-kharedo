/**
 * CAR API ROUTES — GET /api/cars & POST /api/cars
 *
 * GET /api/cars
 *   → Fetches cars from MongoDB "cars" collection
 *   → Supports filters: city, brand, fuel, transmission, year, ownership, budget, km, search
 *   → Supports pagination: page, limit
 *   → Used by: /cars page, homepage, admin cars page
 *
 * POST /api/cars
 *   → Creates a new car in MongoDB (alternative to /api/cars/create)
 *   → Used by: /admin/cars/new (existing admin form)
 *
 * DATA FLOW:
 *   MongoDB "cars" collection → Car.find() → JSON response → Frontend renders CarCard components
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Car from "@/models/Car";

// GET: Fetch cars from MongoDB with optional filters and pagination
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const city = searchParams.get("city");
  const brand = searchParams.get("brand");
  const fuelType = searchParams.get("fuel");
  const transmission = searchParams.get("transmission");
  const year = searchParams.get("year");
  const ownership = searchParams.get("ownership");
  const budgetMin = searchParams.get("budgetMin");
  const budgetMax = searchParams.get("budgetMax");
  const kmMax = searchParams.get("kmMax");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  // Build filter query
  const filter: any = {};

  if (city) filter.city = { $regex: new RegExp(city, "i") };
  if (brand) filter.brand = { $regex: new RegExp(brand, "i") };
  if (fuelType) filter.fuelType = fuelType;
  if (transmission) filter.transmission = transmission;
  if (year) filter.year = parseInt(year);
  if (ownership) filter.ownership = ownership;

  if (budgetMin || budgetMax) {
    filter.price = {};
    if (budgetMin) filter.price.$gte = parseInt(budgetMin);
    if (budgetMax) filter.price.$lte = parseInt(budgetMax);
  }

  if (kmMax) {
    filter.kilometers = { $lte: parseInt(kmMax) };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: new RegExp(search, "i") } },
      { brand: { $regex: new RegExp(search, "i") } },
      { model: { $regex: new RegExp(search, "i") } },
      { city: { $regex: new RegExp(search, "i") } },
    ];
  }

  const skip = (page - 1) * limit;
  const sortObj: any = { [sort]: order === "asc" ? 1 : -1 };

  const [cars, total] = await Promise.all([
    Car.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
    Car.countDocuments(filter),
  ]);

  return NextResponse.json({
    cars,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST: Create a new car document in MongoDB
// Flow: Admin form → POST body → Car.create() → stored in "cars" collection
export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  const car = await Car.create(body);
  return NextResponse.json(car, { status: 201 });
}

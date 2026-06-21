/**
 * API ROUTE: POST /api/cars/create
 *
 * DATA FLOW:
 * 1. Admin submits form from /admin/add-car page
 * 2. This API receives the POST request with car details in JSON body
 * 3. Connects to MongoDB using connectDB()
 * 4. Creates a new document in the "cars" collection using Mongoose Car model
 * 5. Returns the created car object with 201 status
 * 6. Frontend redirects admin to car list page
 *
 * The car then becomes visible on:
 *   - /cars page (fetches from GET /api/cars)
 *   - /admin/cars page (admin car management)
 *   - Homepage popular cars section
 *
 * WHERE TO CHECK:
 *   - Database: MongoDB → carplatform → cars collection
 *   - Frontend: http://localhost:3000/cars
 *   - Admin: http://localhost:3000/admin/cars
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Car from "@/models/Car";

// Helper function to generate a slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim(); // Trim leading/trailing hyphens
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Connect to MongoDB
    await connectDB();

    // Step 2: Parse request body
    const body = await req.json();

    // Step 3: Validate required fields
    const requiredFields = [
      "title", "brand", "model", "year", "price",
      "city", "fuelType", "transmission", "kilometers",
      "ownership", "registrationState",
    ];

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Step 4: Generate and ensure unique slug
    let baseSlug = generateSlug(body.title);
    let slug = baseSlug;
    let counter = 0;

    // Check for existing slug and append counter if necessary
    while (await Car.findOne({ slug })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
    body.slug = slug; // Add the unique slug to the body

    // Step 5: Ensure features and images are arrays
    if (body.features && typeof body.features === "string") {
      // Support comma-separated string input
      body.features = body.features.split(",").map((f: string) => f.trim()).filter(Boolean);
    }
    if (!Array.isArray(body.features)) {
      body.features = [];
    }
    if (!Array.isArray(body.images)) {
      body.images = [];
    }

    // Step 6: Create car document in MongoDB "cars" collection
    const car = await Car.create(body);

    console.log(`[API] Car created: ${car.title} (ID: ${car._id}, Slug: ${car.slug})`);

    // Step 7: Return created car with 201 status
    return NextResponse.json(
      {
        success: true,
        message: "Car added successfully!",
        car,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API] Error creating car:", err.message);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create car. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * CAR REQUEST API — GET & POST /api/car-requests
 *
 * GET: Fetch all car requests (used by admin panel at /admin/requests)
 * POST: Submit a new car request (used by public form at /car-request)
 *
 * DATA FLOW:
 *   User fills /car-request form → POST here → MongoDB "carrequests" collection
 *   Admin views /admin/requests → GET here → renders request list
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CarRequest from "@/models/CarRequest";

// GET: Fetch all car requests for admin panel
export async function GET() {
  await connectDB();
  const requests = await CarRequest.find()
    .populate("userId", "name email city")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(requests);
}

// POST: Create a new car request from user
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Build request object — support both new public form and legacy format
    const requestData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      brand: body.brand || "",
      model: body.model || "",
      budget: body.budget || 0,
      fuelType: body.fuelType || "",
      transmission: body.transmission || "",
      preferredYear: body.preferredYear || 0,
      city: body.city || "",
      message: body.message || "",
      status: "pending",
    };

    // Legacy support: if userId is provided (from old CarDetails component)
    if (body.userId) {
      requestData.userId = body.userId;
      requestData.requestedCar = body.requestedCar || "";
    }

    const carRequest = await CarRequest.create(requestData);

    console.log(`[API] Car request created: ${carRequest.name} - ${carRequest.brand} ${carRequest.model}`);

    return NextResponse.json(
      { success: true, message: "Car request submitted successfully!", request: carRequest },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API] Error creating car request:", err.message);
    return NextResponse.json(
      { error: "Failed to submit request. Please try again." },
      { status: 500 }
    );
  }
}

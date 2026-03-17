/**
 * ADMIN CAR REQUESTS API — GET /api/admin/car-requests
 *
 * Protected endpoint for the admin dashboard table at /admin/car-requests.
 * Returns all car requests with optional status filtering and search.
 *
 * Query params:
 *   ?status=pending    — filter by status
 *   ?search=john       — search by name, email, brand, model
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CarRequest from "@/models/CarRequest";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build filter query
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [requests, filteredTotal] = await Promise.all([
      CarRequest.find(filter)
        .populate("userId", "name email city")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CarRequest.countDocuments(filter),
    ]);

    // Stats for the dashboard header (always counts all, ignoring filters)
    const [allRequests, pendingCount, contactedCount, approvedCount, deliveredCount] =
      await Promise.all([
        CarRequest.countDocuments(),
        CarRequest.countDocuments({ status: "pending" }),
        CarRequest.countDocuments({ status: "sourcing" }),
        CarRequest.countDocuments({ status: "found" }),
        CarRequest.countDocuments({ status: "delivered" }),
      ]);

    return NextResponse.json({
      requests,
      total: filteredTotal,
      page,
      totalPages: Math.ceil(filteredTotal / limit),
      stats: {
        total: allRequests,
        pending: pendingCount,
        contacted: contactedCount,
        approved: approvedCount,
        delivered: deliveredCount,
      },
    });
  } catch (err: any) {
    console.error("[API] Error fetching admin car requests:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch car requests" },
      { status: 500 }
    );
  }
}

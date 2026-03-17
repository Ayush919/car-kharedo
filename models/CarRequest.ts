/**
 * CAR REQUEST MODEL — MongoDB Schema
 * Collection: "carrequests" in the "carplatform" database
 *
 * DATA FLOW:
 *   User fills form at /car-request
 *   → POST /api/car-requests
 *   → Saved in MongoDB "carrequests" collection
 *   → Admin views at /admin/requests
 *   → Admin updates status (pending → sourcing → found → delivered)
 */
import mongoose, { Schema, models } from "mongoose";

const CarRequestSchema = new Schema(
  {
    // User info (public form — no login required)
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },

    // Car preferences
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    budget: { type: Number, default: 0 },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", ""],
      default: "",
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic", ""],
      default: "",
    },
    preferredYear: { type: Number, default: 0 },
    city: { type: String, default: "" },
    message: { type: String, default: "" },

    // Legacy field — kept for backward compatibility with existing data
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    requestedCar: { type: String, default: "" },

    // Request status — managed by admin
    status: {
      type: String,
      enum: ["pending", "sourcing", "found", "delivered", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const CarRequest =
  models.CarRequest || mongoose.model("CarRequest", CarRequestSchema);
export default CarRequest;

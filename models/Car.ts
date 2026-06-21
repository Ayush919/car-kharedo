/**
 * CAR MODEL — MongoDB Schema
 * Collection: "cars" in the "carplatform" database
 *
 * DATA FLOW:
 *   Admin Form (/admin/add-car)
 *   → POST request to /api/cars/create
 *   → API calls Car.create(body) using this model
 *   → Document stored in MongoDB "cars" collection
 *   → Frontend fetches via GET /api/cars using Car.find()
 *   → Cars displayed on /cars page and homepage
 *
 * The slug field is added for SEO-friendly URLs.
 *
 * FIELDS:
 *   title, brand, model, year, price, city, fuelType, transmission,
 *   kilometers, ownership, registrationState, description, features[],
 *   images[], createdAt (auto), updatedAt (auto), slug (new)
 */
import mongoose, { Schema, models } from "mongoose";

const CarSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true }, // Added slug field
    brand: { type: String, required: true, index: true },
    model: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    price: { type: Number, required: true, index: true },
    city: { type: String, required: true, index: true },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      required: true,
      index: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
      index: true,
    },
    kilometers: { type: Number, required: true },
    ownership: {
      type: String,
      enum: ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"],
      required: true,
    },
    registrationState: { type: String, required: true },
    description: { type: String, default: "" },
    features: [{ type: String }],
    inspectionReport: { type: String, default: "" },
    serviceHistory: { type: String, default: "" },
    // Stores Uploadcare CDN URLs. Example: "https://ucarecdn.com/FILE_UUID/"
    // For optimized delivery, append transformations to the URL:
    //   /-/resize/800x600/   → resize to 800x600
    //   /-/format/webp/      → convert to WebP for smaller file sizes
    //   /-/quality/smart/    → adaptive quality compression
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Text index for search
CarSchema.index({ title: "text", brand: "text", model: "text", city: "text" });

const Car = models.Car || mongoose.model("Car", CarSchema);
export default Car;

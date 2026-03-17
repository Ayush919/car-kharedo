/**
 * DEMO DATA SCRIPT
 * File: lib/demoData.ts
 *
 * PURPOSE:
 * Insert sample cars into MongoDB for testing and development.
 *
 * HOW TO RUN:
 *   npx tsx lib/demoData.ts
 *
 * Or add to package.json scripts:
 *   "demo": "tsx lib/demoData.ts"
 * Then run: npm run demo
 *
 * WHAT IT DOES:
 * 1. Connects directly to MongoDB (no dev server needed)
 * 2. Inserts 3 sample car documents into the "cars" collection
 * 3. Prints summary and exits
 *
 * WHERE TO CHECK DATA:
 *   - Database: MongoDB → carplatform → cars collection
 *   - Frontend: http://localhost:3000/cars
 *   - Admin: http://localhost:3000/admin/cars
 *
 * DATA FLOW:
 *   This script → MongoDB "cars" collection → /api/cars reads it → /cars page shows it
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/carplatform";

// Define Car schema inline (avoids Next.js module issues with tsx)
const CarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    kilometers: { type: Number, required: true },
    ownership: { type: String, required: true },
    registrationState: { type: String, required: true },
    description: { type: String, default: "" },
    features: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Sample car data — 3 demo cars as requested
const demoCars = [
  {
    title: "Honda City 2023 VX CVT",
    brand: "Honda",
    model: "City",
    year: 2023,
    price: 839000,
    city: "Delhi",
    fuelType: "Petrol",
    transmission: "Manual",
    kilometers: 23000,
    ownership: "1st Owner",
    registrationState: "DL",
    description:
      "Well maintained Honda City. Single owner, all service records available. Excellent mileage and smooth drive.",
    features: ["Sunroof", "Rear Camera", "Cruise Control", "LED Headlights", "Touchscreen"],
    images: [
      "https://picsum.photos/seed/honda-city/400/300",
      "https://picsum.photos/seed/honda-city-2/400/300",
    ],
  },
  {
    title: "Hyundai Creta 2022 SX(O)",
    brand: "Hyundai",
    model: "Creta",
    year: 2022,
    price: 1150000,
    city: "Noida",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 18000,
    ownership: "1st Owner",
    registrationState: "UP",
    description:
      "Single owner Hyundai Creta in excellent condition. Top variant with panoramic sunroof and connected car tech.",
    features: ["Touchscreen", "Reverse Camera", "Panoramic Sunroof", "Ventilated Seats", "ADAS"],
    images: [
      "https://picsum.photos/seed/hyundai-creta/400/300",
      "https://picsum.photos/seed/hyundai-creta-2/400/300",
    ],
  },
  {
    title: "Maruti Swift 2021 ZXI+",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2021,
    price: 620000,
    city: "Mumbai",
    fuelType: "Petrol",
    transmission: "Manual",
    kilometers: 35000,
    ownership: "1st Owner",
    registrationState: "MH",
    description:
      "Sporty Maruti Swift with excellent fuel efficiency. Perfect city car with all features intact.",
    features: ["Touchscreen", "Rear Camera", "Push Button Start", "ABS", "Alloy Wheels"],
    images: [
      "https://picsum.photos/seed/maruti-swift/400/300",
      "https://picsum.photos/seed/maruti-swift-2/400/300",
    ],
  },
];

async function insertDemoData() {
  console.log("========================================");
  console.log("  carKharedo Demo Data Script");
  console.log("========================================\n");
  console.log(`Connecting to: ${MONGODB_URI}\n`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully!\n");
  } catch (err: any) {
    console.error("Failed to connect to MongoDB:", err.message);
    console.error("\nMake sure MongoDB is running:");
    console.error("  - Local: run 'mongod' in a terminal");
    console.error("  - Atlas: update MONGODB_URI in .env.local");
    process.exit(1);
  }

  const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

  // Insert demo cars (does NOT clear existing data — just adds new ones)
  console.log(`Inserting ${demoCars.length} demo cars...\n`);

  for (const carData of demoCars) {
    const car = await Car.create(carData);
    console.log(`  + ${car.title} (₹${car.price.toLocaleString("en-IN")})`);
  }

  // Show total count
  const totalCars = await Car.countDocuments();

  console.log("\n========================================");
  console.log("  Demo Data Inserted!");
  console.log("========================================");
  console.log(`  New cars added: ${demoCars.length}`);
  console.log(`  Total cars in DB: ${totalCars}`);
  console.log("\n  Check your data:");
  console.log("  - Frontend: http://localhost:3000/cars");
  console.log("  - Admin: http://localhost:3000/admin/cars");
  console.log("  - Add car: http://localhost:3000/admin/add-car");
  console.log("  - Database: MongoDB → carplatform → cars collection");
  console.log("========================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

insertDemoData();

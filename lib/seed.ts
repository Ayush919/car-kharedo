/**
 * Standalone Database Seed Script
 *
 * Run: npm run seed
 *
 * This connects directly to MongoDB (no dev server needed) and creates:
 * - Admin user (admin@carplatform.com / admin123)
 * - Sample user (rahul@example.com / user123)
 * - 12 sample car listings
 *
 * Requirements:
 * - MongoDB must be running (locally or Atlas)
 * - MONGODB_URI set in .env.local (or defaults to localhost)
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load env vars from .env.local
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/carplatform";

// Define schemas inline to avoid Next.js module resolution issues with tsx
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    city: { type: String, default: "" },
  },
  { timestamps: true }
);

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
    inspectionReport: { type: String, default: "" },
    serviceHistory: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const sampleCars = [
  {
    title: "Honda City 2023 VX CVT", brand: "Honda", model: "City", year: 2023,
    price: 1250000, city: "Delhi", fuelType: "Petrol", transmission: "Automatic",
    kilometers: 12000, ownership: "1st Owner", registrationState: "Delhi",
    description: "Well-maintained Honda City with full service history.",
    features: ["Sunroof", "Touchscreen", "Rear Camera", "LED Headlights", "Cruise Control", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Overall: 9.2/10",
    serviceHistory: "All services at authorized Honda dealership.", images: [],
  },
  {
    title: "Hyundai Creta 2022 SX(O)", brand: "Hyundai", model: "Creta", year: 2022,
    price: 1450000, city: "Mumbai", fuelType: "Diesel", transmission: "Automatic",
    kilometers: 25000, ownership: "1st Owner", registrationState: "Maharashtra",
    description: "Top-end Hyundai Creta with panoramic sunroof and ADAS.",
    features: ["Panoramic Sunroof", "ADAS", "Ventilated Seats", "Bose Sound", "360 Camera", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 9.5/10",
    serviceHistory: "Regular servicing at Hyundai authorized center.", images: [],
  },
  {
    title: "Maruti Swift 2021 ZXI+", brand: "Maruti Suzuki", model: "Swift", year: 2021,
    price: 650000, city: "Bangalore", fuelType: "Petrol", transmission: "Manual",
    kilometers: 35000, ownership: "1st Owner", registrationState: "Karnataka",
    description: "Sporty and fuel-efficient Maruti Swift.",
    features: ["Touchscreen", "Rear Camera", "Push Button Start", "ABS", "2 Airbags"],
    inspectionReport: "Engine: Good | Overall: 8.5/10",
    serviceHistory: "Serviced every 10,000 km at Maruti ARENA.", images: [],
  },
  {
    title: "Toyota Fortuner 2022 Legender", brand: "Toyota", model: "Fortuner", year: 2022,
    price: 4200000, city: "Delhi", fuelType: "Diesel", transmission: "Automatic",
    kilometers: 18000, ownership: "1st Owner", registrationState: "Delhi",
    description: "Premium Fortuner Legender with 4x4.",
    features: ["JBL Sound", "Wireless Charging", "360 Camera", "7 Seats", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 9.8/10",
    serviceHistory: "Toyota authorized service center.", images: [],
  },
  {
    title: "Tata Nexon EV 2023 Max LR", brand: "Tata", model: "Nexon EV", year: 2023,
    price: 1750000, city: "Pune", fuelType: "Electric", transmission: "Automatic",
    kilometers: 8000, ownership: "1st Owner", registrationState: "Maharashtra",
    description: "Long range Nexon EV with 437km range.",
    features: ["Connected Car", "Sunroof", "Fast Charging", "Drive Modes", "6 Airbags"],
    inspectionReport: "Battery: 98% | Overall: 9.6/10",
    serviceHistory: "Tata authorized EV service center.", images: [],
  },
  {
    title: "Mahindra XUV700 2022 AX7 L", brand: "Mahindra", model: "XUV700", year: 2022,
    price: 2100000, city: "Hyderabad", fuelType: "Diesel", transmission: "Automatic",
    kilometers: 30000, ownership: "1st Owner", registrationState: "Telangana",
    description: "Feature-loaded XUV700 with ADAS Level 2.",
    features: ["ADAS Level 2", "Panoramic Sunroof", "Wireless Charging", "360 Camera", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 9.0/10",
    serviceHistory: "Mahindra authorized service.", images: [],
  },
  {
    title: "Kia Seltos 2023 HTX+", brand: "Kia", model: "Seltos", year: 2023,
    price: 1350000, city: "Chennai", fuelType: "Petrol", transmission: "Automatic",
    kilometers: 15000, ownership: "1st Owner", registrationState: "Tamil Nadu",
    description: "Stylish Kia Seltos with turbo engine.",
    features: ["Bose Sound", "Ventilated Seats", "Sunroof", "360 Camera", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 9.1/10",
    serviceHistory: "Regular Kia authorized servicing.", images: [],
  },
  {
    title: "Volkswagen Virtus 2023 GT Plus", brand: "Volkswagen", model: "Virtus", year: 2023,
    price: 1650000, city: "Bangalore", fuelType: "Petrol", transmission: "Automatic",
    kilometers: 10000, ownership: "1st Owner", registrationState: "Karnataka",
    description: "German engineering with 1.5L TSI turbo.",
    features: ["Virtual Cockpit", "Ventilated Seats", "Sunroof", "Cruise Control", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 9.4/10",
    serviceHistory: "All services at VW authorized center.", images: [],
  },
  {
    title: "Maruti Baleno 2022 Alpha CVT", brand: "Maruti Suzuki", model: "Baleno", year: 2022,
    price: 850000, city: "Delhi", fuelType: "Petrol", transmission: "Automatic",
    kilometers: 20000, ownership: "2nd Owner", registrationState: "Delhi",
    description: "Premium hatchback with HUD and 360 camera.",
    features: ["HUD", "360 Camera", "Auto AC", "Cruise Control", "6 Airbags"],
    inspectionReport: "Engine: Good | Overall: 8.3/10",
    serviceHistory: "Regular servicing at NEXA.", images: [],
  },
  {
    title: "MG Hector 2021 Sharp Pro", brand: "MG", model: "Hector", year: 2021,
    price: 1550000, city: "Mumbai", fuelType: "Diesel", transmission: "Manual",
    kilometers: 40000, ownership: "1st Owner", registrationState: "Maharashtra",
    description: "Internet car with i-SMART technology.",
    features: ["14\" Touchscreen", "Panoramic Sunroof", "Wireless Charging", "Leather Seats", "6 Airbags"],
    inspectionReport: "Engine: Good | Overall: 8.0/10",
    serviceHistory: "All services at MG authorized workshops.", images: [],
  },
  {
    title: "Hyundai i20 2023 Asta(O)", brand: "Hyundai", model: "i20", year: 2023,
    price: 1050000, city: "Kolkata", fuelType: "Petrol", transmission: "Automatic",
    kilometers: 9000, ownership: "1st Owner", registrationState: "West Bengal",
    description: "Premium hatchback with BlueLink connected tech.",
    features: ["Sunroof", "Bose Sound", "Wireless Charging", "Air Purifier", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 9.3/10",
    serviceHistory: "Hyundai authorized service.", images: [],
  },
  {
    title: "Tata Harrier 2022 XZA+", brand: "Tata", model: "Harrier", year: 2022,
    price: 1800000, city: "Pune", fuelType: "Diesel", transmission: "Automatic",
    kilometers: 28000, ownership: "1st Owner", registrationState: "Maharashtra",
    description: "Bold Tata Harrier on Land Rover D8 platform.",
    features: ["Panoramic Sunroof", "JBL 9-speaker", "360 Camera", "LED DRLs", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall: 8.8/10",
    serviceHistory: "Tata authorized service center.", images: [],
  },
];

async function seed() {
  console.log("========================================");
  console.log("  carKharedo Database Seed Script");
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

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

  // Clear existing data
  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Car.deleteMany({});

  // Create admin user with hashed password
  console.log("Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await User.create({
    name: "Admin",
    email: "admin@carplatform.com",
    password: adminPassword,
    role: "admin",
    city: "Delhi",
  });
  console.log(`  Admin: ${admin.email} (password: admin123)`);

  // Verify bcrypt works correctly
  const verifyAdmin = await bcrypt.compare("admin123", admin.password);
  console.log(`  Password hash verify: ${verifyAdmin ? "PASS" : "FAIL"}`);

  // Create sample user
  console.log("Creating sample user...");
  const userPwd = await bcrypt.hash("user123", 10);
  const user = await User.create({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: userPwd,
    role: "user",
    city: "Mumbai",
  });
  console.log(`  User: ${user.email} (password: user123)`);

  // Insert cars
  console.log(`\nInserting ${sampleCars.length} sample cars...`);
  await Car.insertMany(sampleCars);
  console.log("  Cars inserted!");

  // Summary
  const userCount = await User.countDocuments();
  const carCount = await Car.countDocuments();

  console.log("\n========================================");
  console.log("  Seed Complete!");
  console.log("========================================");
  console.log(`  Users: ${userCount}`);
  console.log(`  Cars:  ${carCount}`);
  console.log("\n  Login credentials:");
  console.log("  Admin: admin@carplatform.com / admin123");
  console.log("  User:  rahul@example.com / user123");
  console.log("========================================\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed();

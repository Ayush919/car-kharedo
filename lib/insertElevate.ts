/**
 * Insert Honda Elevate demo car into MongoDB
 * Run: npx tsx lib/insertElevate.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/carplatform";

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

async function insert() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!\n");

  const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

  const elevate = await Car.create({
    title: "Honda Elevate 2024 ZX CVT",
    brand: "Honda",
    model: "Elevate",
    year: 2024,
    price: 1650000,
    city: "Delhi",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 12000,
    ownership: "1st Owner",
    registrationState: "DL",
    description:
      "A well-maintained Honda Elevate ZX CVT with premium interior, smooth automatic transmission, and excellent fuel efficiency. Perfect family SUV with advanced safety features, touchscreen infotainment, rear camera, and comfortable seating. 1498 cc engine producing 119 bhp. Mileage: 15 km/l. Metallic Grey color. 5-seater.",
    features: [
      "Touchscreen Infotainment",
      "Rear Camera",
      "6 Airbags",
      "Lane Watch Camera",
      "Auto AC",
      "Cruise Control",
      "LED Headlights",
      "Sunroof",
      "Push Button Start",
      "Alloy Wheels",
      "ADAS",
      "Wireless Charging",
    ],
    inspectionReport:
      "Engine: Excellent | Transmission: Excellent | Suspension: Good | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.4/10",
    serviceHistory:
      "All services done at authorized Honda dealership. Last service Dec 2024. Under manufacturer warranty till 2027.",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/142515/elevate-exterior-right-front-three-quarter-29.png?isig=0&q=80",
    ],
  });

  console.log("Honda Elevate inserted successfully!");
  console.log(`  Title: ${elevate.title}`);
  console.log(`  Price: ₹${elevate.price.toLocaleString("en-IN")}`);
  console.log(`  ID: ${elevate._id}`);
  console.log(`\nView at: http://localhost:3000/cars/${elevate._id}`);

  await mongoose.disconnect();
  process.exit(0);
}

insert().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});

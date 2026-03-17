/**
 * ============================================================
 * carKharedo - Database Seed Script
 * ============================================================
 *
 * This script populates the MongoDB database with demo data:
 *   - 1 Admin user (admin@carplatform.com / admin123)
 *   - 5 Demo users (password: user123)
 *   - 20 Car listings with working Unsplash images
 *   - 5 Sample car requests in various statuses
 *
 * USAGE:
 *   node scripts/seed.js
 *
 * REQUIREMENTS:
 *   - MongoDB must be running on localhost:27017
 *   - Run from the project root directory
 *
 * DATABASE: carplatform
 * COLLECTIONS: users, cars, carrequests
 * ============================================================
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://127.0.0.1:27017/carplatform";

// ============================================================
// IMAGE URLS - Working Unsplash car images
// ============================================================
// Format: https://images.unsplash.com/photo-{ID}?w=800&q=80
// These are direct image URLs that work with Next.js Image component.
// Ensure "images.unsplash.com" is in next.config.js remotePatterns.

const IMAGES = {
  honda: [
    "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    "https://images.unsplash.com/photo-1606611013016-969c19ba27d5?w=800&q=80",
  ],
  hyundai: [
    "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800&q=80",
    "https://images.unsplash.com/photo-1625231334401-4c6ae07f0b04?w=800&q=80",
  ],
  maruti: [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0afe?w=800&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  ],
  toyota: [
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
  ],
  tata: [
    "https://images.unsplash.com/photo-1617814076668-8dfc6fe3a4e0?w=800&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
  ],
  mahindra: [
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  ],
  kia: [
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
  ],
  bmw: [
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
  ],
  mercedes: [
    "https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=800&q=80",
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",
  ],
  audi: [
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
  ],
  skoda: [
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
  ],
  volkswagen: [
    "https://images.unsplash.com/photo-1471479917193-f00955256257?w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  ],
  mg: [
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
  ],
};

// ============================================================
// CAR DATA - 20 realistic Indian car listings
// ============================================================
// Schema fields reference:
//   title           - Display title (brand + model + year + variant)
//   brand           - Car manufacturer (e.g., "Toyota", "Honda")
//   model           - Car model name (e.g., "Fortuner", "City")
//   year            - Manufacturing year (number)
//   price           - Price in INR (number, e.g., 1250000 = 12.5 lakh)
//   city            - Listing location (e.g., "Delhi", "Mumbai")
//   fuelType        - Enum: "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid"
//   transmission    - Enum: "Manual" | "Automatic"
//   kilometers      - Odometer reading (number)
//   ownership       - Enum: "1st Owner" | "2nd Owner" | "3rd Owner" | "4th Owner+"
//   registrationState - State of vehicle registration
//   description     - Free-text car description
//   features        - Array of feature strings
//   inspectionReport - Inspection summary text
//   serviceHistory  - Service history text
//   images          - Array of image URL strings
//   createdAt       - Auto-generated timestamp
//   updatedAt       - Auto-generated timestamp

const CARS = [
  {
    title: "Honda City 2023 VX CVT",
    brand: "Honda", model: "City", year: 2023, price: 1250000, city: "Delhi",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 12000, ownership: "1st Owner",
    registrationState: "Delhi",
    description: "Well-maintained Honda City with full service history. Premium sedan with excellent mileage.",
    features: ["Sunroof", "Touchscreen", "Rear Camera", "LED Headlights", "Cruise Control", "Keyless Entry", "Alloy Wheels", "Auto AC", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.2/10",
    serviceHistory: "All services done at authorized Honda dealership.",
    images: IMAGES.honda,
  },
  {
    title: "Hyundai Creta 2022 SX(O)",
    brand: "Hyundai", model: "Creta", year: 2022, price: 1450000, city: "Mumbai",
    fuelType: "Diesel", transmission: "Automatic", kilometers: 25000, ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Top-end Hyundai Creta with panoramic sunroof and ADAS features.",
    features: ["Panoramic Sunroof", "ADAS", "Ventilated Seats", "Bose Sound", "Wireless Charging", "360 Camera", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.5/10",
    serviceHistory: "Regular servicing at Hyundai authorized center.",
    images: IMAGES.hyundai,
  },
  {
    title: "Maruti Swift 2021 ZXI+",
    brand: "Maruti Suzuki", model: "Swift", year: 2021, price: 650000, city: "Bangalore",
    fuelType: "Petrol", transmission: "Manual", kilometers: 35000, ownership: "1st Owner",
    registrationState: "Karnataka",
    description: "Sporty and fuel-efficient Maruti Swift. Best-in-class mileage of 22 kmpl.",
    features: ["Touchscreen", "Rear Camera", "Push Button Start", "Auto Headlights", "ABS", "Alloy Wheels"],
    inspectionReport: "Engine: Good | Overall Score: 8.5/10",
    serviceHistory: "Serviced every 10,000 km at Maruti ARENA.",
    images: IMAGES.maruti,
  },
  {
    title: "Toyota Fortuner 2022 Legender",
    brand: "Toyota", model: "Fortuner", year: 2022, price: 4200000, city: "Delhi",
    fuelType: "Diesel", transmission: "Automatic", kilometers: 18000, ownership: "1st Owner",
    registrationState: "Delhi",
    description: "Premium Fortuner Legender with 2.8L diesel engine and 4x4 capability.",
    features: ["JBL Sound", "Wireless Charging", "Cooled Seats", "360 Camera", "Terrain Modes", "7 Seats", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.8/10",
    serviceHistory: "Toyota authorized service center.",
    images: IMAGES.toyota,
  },
  {
    title: "Tata Nexon EV 2023 Max LR",
    brand: "Tata", model: "Nexon EV", year: 2023, price: 1750000, city: "Pune",
    fuelType: "Electric", transmission: "Automatic", kilometers: 8000, ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Long range Nexon EV with 437km range. 5-star safety rated.",
    features: ["Connected Car", "Ventilated Seats", "Sunroof", "Fast Charging", "Regenerative Braking", "JBL Speakers", "6 Airbags"],
    inspectionReport: "Battery Health: 98% | Overall Score: 9.6/10",
    serviceHistory: "Tata EV service center. Battery warranty active till 2031.",
    images: IMAGES.tata,
  },
  {
    title: "Mahindra XUV700 2022 AX7 L",
    brand: "Mahindra", model: "XUV700", year: 2022, price: 2100000, city: "Hyderabad",
    fuelType: "Diesel", transmission: "Automatic", kilometers: 30000, ownership: "1st Owner",
    registrationState: "Telangana",
    description: "Feature-loaded XUV700 with ADAS Level 2 and dual screen setup.",
    features: ["ADAS Level 2", "Dual Screens", "Alexa Built-in", "Panoramic Sunroof", "3D Sound", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.0/10",
    serviceHistory: "Mahindra authorized service.",
    images: IMAGES.mahindra,
  },
  {
    title: "Kia Seltos 2023 HTX+",
    brand: "Kia", model: "Seltos", year: 2023, price: 1350000, city: "Chennai",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 15000, ownership: "1st Owner",
    registrationState: "Tamil Nadu",
    description: "Stylish Kia Seltos with turbocharged petrol engine.",
    features: ["10.25\" Touchscreen", "Bose Sound", "Ventilated Seats", "UVO Connected", "Sunroof", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.1/10",
    serviceHistory: "Kia authorized servicing. Warranty valid till 2028.",
    images: IMAGES.kia,
  },
  {
    title: "BMW 3 Series 2021 320d Sport",
    brand: "BMW", model: "3 Series", year: 2021, price: 3500000, city: "Mumbai",
    fuelType: "Diesel", transmission: "Automatic", kilometers: 22000, ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "BMW 320d Sport Line with M Sport package. 190hp diesel with 8-speed auto.",
    features: ["M Sport Package", "Live Cockpit", "Harman Kardon Sound", "Ambient Lighting", "Head-Up Display", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.5/10",
    serviceHistory: "BMW authorized service.",
    images: IMAGES.bmw,
  },
  {
    title: "Mercedes-Benz C-Class 2022 C200",
    brand: "Mercedes", model: "C-Class", year: 2022, price: 5200000, city: "Delhi",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 15000, ownership: "1st Owner",
    registrationState: "Delhi",
    description: "The all-new W206 C-Class with MBUX infotainment. A baby S-Class.",
    features: ["MBUX System", "11.9\" Display", "Burmester Sound", "Digital Headlights", "Ambient Lighting", "9 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.7/10",
    serviceHistory: "Mercedes-Benz Star Service.",
    images: IMAGES.mercedes,
  },
  {
    title: "Audi A4 2022 Premium Plus",
    brand: "Audi", model: "A4", year: 2022, price: 4500000, city: "Bangalore",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 16000, ownership: "1st Owner",
    registrationState: "Karnataka",
    description: "Audi A4 Premium Plus with 2.0 TFSI engine. Quattro all-wheel drive.",
    features: ["Virtual Cockpit", "Bang & Olufsen Sound", "Matrix LED", "Quattro AWD", "Wireless CarPlay", "8 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.4/10",
    serviceHistory: "Audi authorized service with full digital records.",
    images: IMAGES.audi,
  },
  {
    title: "Skoda Slavia 2023 Style 1.5 TSI",
    brand: "Skoda", model: "Slavia", year: 2023, price: 1550000, city: "Bangalore",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 12000, ownership: "1st Owner",
    registrationState: "Karnataka",
    description: "Czech sedan with powerful 1.5 TSI engine and best-in-class driving dynamics.",
    features: ["Ventilated Seats", "Sunroof", "Wireless CarPlay", "10\" Touchscreen", "Cruise Control", "6 Airbags", "ESC"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.2/10",
    serviceHistory: "Skoda authorized service.",
    images: IMAGES.skoda,
  },
  {
    title: "Volkswagen Virtus 2023 GT Plus",
    brand: "Volkswagen", model: "Virtus", year: 2023, price: 1650000, city: "Pune",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 10000, ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "German engineering with 1.5L TSI turbo. Thrilling performance.",
    features: ["Virtual Cockpit", "Wireless CarPlay", "Ventilated Seats", "Sunroof", "Cruise Control", "6 Airbags", "ESC"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.4/10",
    serviceHistory: "VW authorized center. Extended warranty.",
    images: IMAGES.volkswagen,
  },
  {
    title: "MG Hector 2021 Sharp Pro",
    brand: "MG", model: "Hector", year: 2021, price: 1550000, city: "Mumbai",
    fuelType: "Diesel", transmission: "Manual", kilometers: 40000, ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Internet car with i-SMART technology. 14\" portrait touchscreen.",
    features: ["14\" Touchscreen", "i-SMART", "Panoramic Sunroof", "Infinity Sound", "Wireless Charging", "6 Airbags"],
    inspectionReport: "Engine: Good | Overall Score: 8.0/10",
    serviceHistory: "MG authorized workshops.",
    images: IMAGES.mg,
  },
  {
    title: "Toyota Innova Crysta 2022 VX",
    brand: "Toyota", model: "Innova Crysta", year: 2022, price: 2400000, city: "Chennai",
    fuelType: "Diesel", transmission: "Automatic", kilometers: 35000, ownership: "1st Owner",
    registrationState: "Tamil Nadu",
    description: "India's favorite MPV. Captain seats and premium features.",
    features: ["Captain Seats", "Roof-Mounted AC", "Touchscreen", "Cruise Control", "7 Seats", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.0/10",
    serviceHistory: "Toyota authorized service.",
    images: IMAGES.toyota,
  },
  {
    title: "Hyundai i20 2023 Asta(O)",
    brand: "Hyundai", model: "i20", year: 2023, price: 1050000, city: "Kolkata",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 9000, ownership: "1st Owner",
    registrationState: "West Bengal",
    description: "Premium hatchback with segment-best features and sportier design.",
    features: ["Sunroof", "BlueLink", "Bose Sound", "10.25\" Display", "Wireless Charging", "Air Purifier", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.3/10",
    serviceHistory: "Hyundai authorized service.",
    images: IMAGES.hyundai,
  },
  {
    title: "Tata Harrier 2022 XZA+",
    brand: "Tata", model: "Harrier", year: 2022, price: 1800000, city: "Pune",
    fuelType: "Diesel", transmission: "Automatic", kilometers: 28000, ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Bold Tata Harrier built on Land Rover D8 platform. 5-star safety.",
    features: ["Panoramic Sunroof", "JBL 9-speaker", "Connected Car", "Terrain Response", "360 Camera", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 8.8/10",
    serviceHistory: "Tata authorized service center.",
    images: IMAGES.tata,
  },
  {
    title: "Mahindra Thar 2023 LX Hard Top",
    brand: "Mahindra", model: "Thar", year: 2023, price: 1650000, city: "Jaipur",
    fuelType: "Diesel", transmission: "Manual", kilometers: 14000, ownership: "1st Owner",
    registrationState: "Rajasthan",
    description: "The iconic Thar with 4x4 for serious off-roading.",
    features: ["4x4", "Touchscreen", "Roll Cage", "Cruise Control", "Rear Camera", "ABS", "ESP"],
    inspectionReport: "Engine: Excellent | 4WD: Excellent | Overall Score: 9.3/10",
    serviceHistory: "Mahindra authorized service.",
    images: IMAGES.mahindra,
  },
  {
    title: "Honda Amaze 2023 VX CVT",
    brand: "Honda", model: "Amaze", year: 2023, price: 920000, city: "Ahmedabad",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 11000, ownership: "1st Owner",
    registrationState: "Gujarat",
    description: "Compact sedan with class-leading boot space and smooth CVT.",
    features: ["8\" Touchscreen", "Rear Camera", "LED Headlights", "Push Button Start", "Auto AC", "Cruise Control"],
    inspectionReport: "Engine: Excellent | Overall Score: 9.0/10",
    serviceHistory: "Honda authorized dealer servicing.",
    images: IMAGES.honda,
  },
  {
    title: "Kia Sonet 2022 HTX+ Turbo",
    brand: "Kia", model: "Sonet", year: 2022, price: 1100000, city: "Hyderabad",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 18000, ownership: "1st Owner",
    registrationState: "Telangana",
    description: "Compact SUV with turbo petrol engine and connected car technology.",
    features: ["10.25\" Touchscreen", "Bose Sound", "Ventilated Seats", "UVO Connected", "Sunroof", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Overall Score: 8.9/10",
    serviceHistory: "Kia authorized service center.",
    images: IMAGES.kia,
  },
  {
    title: "Maruti Baleno 2022 Alpha CVT",
    brand: "Maruti Suzuki", model: "Baleno", year: 2022, price: 850000, city: "Delhi",
    fuelType: "Petrol", transmission: "Automatic", kilometers: 20000, ownership: "2nd Owner",
    registrationState: "Delhi",
    description: "Premium hatchback with spacious interiors and great fuel efficiency.",
    features: ["HUD", "360 View Camera", "9\" Touchscreen", "Auto AC", "LED Lights", "Cruise Control", "6 Airbags"],
    inspectionReport: "Engine: Good | Overall Score: 8.3/10",
    serviceHistory: "Regular servicing at NEXA dealership.",
    images: IMAGES.maruti,
  },
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!\n");

  const db = mongoose.connection.db;

  // Clear existing data
  console.log("Clearing existing data...");
  await db.collection("users").deleteMany({});
  await db.collection("cars").deleteMany({});
  await db.collection("carrequests").deleteMany({});
  console.log("All collections cleared.\n");

  // ---- INSERT ADMIN ----
  const adminHash = await bcrypt.hash("admin123", 12);
  await db.collection("users").insertOne({
    name: "Admin",
    email: "admin@carplatform.com",
    password: adminHash,
    role: "admin",
    city: "Delhi",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("[+] Admin user created: admin@carplatform.com / admin123");

  // ---- INSERT DEMO USERS ----
  const userHash = await bcrypt.hash("user123", 12);
  const demoUsersResult = await db.collection("users").insertMany([
    { name: "Rahul Sharma", email: "rahul@example.com", password: userHash, role: "user", city: "Mumbai", createdAt: new Date(), updatedAt: new Date() },
    { name: "Priya Patel", email: "priya@example.com", password: userHash, role: "user", city: "Bangalore", createdAt: new Date(), updatedAt: new Date() },
    { name: "Amit Singh", email: "amit@example.com", password: userHash, role: "user", city: "Delhi", createdAt: new Date(), updatedAt: new Date() },
    { name: "Sneha Gupta", email: "sneha@example.com", password: userHash, role: "user", city: "Chennai", createdAt: new Date(), updatedAt: new Date() },
    { name: "Vikram Reddy", email: "vikram@example.com", password: userHash, role: "user", city: "Hyderabad", createdAt: new Date(), updatedAt: new Date() },
  ]);
  const userIds = Object.values(demoUsersResult.insertedIds);
  console.log("[+] 5 demo users created (password: user123)");

  // ---- INSERT 20 CARS ----
  const carsWithTimestamps = CARS.map((car) => ({
    ...car,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await db.collection("cars").insertMany(carsWithTimestamps);
  console.log("[+] " + CARS.length + " cars inserted with Unsplash images");

  // ---- INSERT CAR REQUESTS ----
  await db.collection("carrequests").insertMany([
    { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", brand: "Toyota", model: "Fortuner", budget: 4000000, fuelType: "Diesel", transmission: "Automatic", preferredYear: 2022, city: "Mumbai", message: "Looking for a white Fortuner Legender.", userId: userIds[0], status: "pending", createdAt: new Date(), updatedAt: new Date() },
    { name: "Priya Patel", email: "priya@example.com", phone: "9876543211", brand: "Hyundai", model: "Creta", budget: 1500000, fuelType: "Petrol", transmission: "Automatic", preferredYear: 2023, city: "Bangalore", message: "Need top-end Creta with sunroof.", userId: userIds[1], status: "sourcing", createdAt: new Date(), updatedAt: new Date() },
    { name: "Amit Singh", email: "amit@example.com", phone: "9876543212", brand: "BMW", model: "3 Series", budget: 3500000, fuelType: "Diesel", transmission: "Automatic", preferredYear: 2021, city: "Delhi", message: "Interested in BMW 320d M Sport.", userId: userIds[2], status: "found", createdAt: new Date(), updatedAt: new Date() },
    { name: "Sneha Gupta", email: "sneha@example.com", phone: "9876543213", brand: "Tata", model: "Nexon EV", budget: 1800000, fuelType: "Electric", transmission: "Automatic", preferredYear: 2023, city: "Chennai", message: "Looking for Nexon EV Max long range.", userId: userIds[3], status: "pending", createdAt: new Date(), updatedAt: new Date() },
    { name: "Vikram Reddy", email: "vikram@example.com", phone: "9876543214", brand: "Mahindra", model: "Thar", budget: 1700000, fuelType: "Diesel", transmission: "Manual", preferredYear: 2023, city: "Hyderabad", message: "Want a hard-top Thar in black. Must be 4x4.", userId: userIds[4], status: "delivered", createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log("[+] 5 car requests created\n");

  // ---- VERIFY ----
  const userCount = await db.collection("users").countDocuments();
  const carCount = await db.collection("cars").countDocuments();
  const reqCount = await db.collection("carrequests").countDocuments();

  console.log("=".repeat(50));
  console.log("  SEED COMPLETE");
  console.log("=".repeat(50));
  console.log("  Users:        " + userCount + " (1 admin + 5 demo)");
  console.log("  Cars:         " + carCount);
  console.log("  Car Requests: " + reqCount);
  console.log("=".repeat(50));
  console.log("");
  console.log("  Admin Login:  admin@carplatform.com / admin123");
  console.log("  User Login:   rahul@example.com / user123");
  console.log("");
  console.log("  Brands: Honda, Hyundai, Maruti Suzuki, Toyota, Tata,");
  console.log("          Mahindra, Kia, BMW, Mercedes, Audi, Skoda,");
  console.log("          Volkswagen, MG");
  console.log("");
  console.log("  Pagination: GET /api/cars?page=1&limit=9");
  console.log("              Page 1: 9 cars | Page 2: 9 cars | Page 3: 2 cars");
  console.log("=".repeat(50));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("SEED FAILED:", err.message);
  process.exit(1);
});

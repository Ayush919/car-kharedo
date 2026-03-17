/**
 * DEMO CAR SEED SCRIPT
 *
 * Populates the database with 20 realistic car listings using free image URLs.
 * Images sourced from Unsplash (whitelisted in next.config.js).
 *
 * Run: npx tsx lib/seedCars.ts
 *
 * After running, visit http://localhost:3000/cars to see all listings.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carplatform";

// Inline schema to avoid Next.js module resolution issues
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

const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

const demoCars = [
  {
    title: "Honda City 2023 VX CVT",
    brand: "Honda",
    model: "City",
    year: 2023,
    price: 1250000,
    city: "Delhi",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 12000,
    ownership: "1st Owner",
    registrationState: "Delhi",
    description: "Well-maintained Honda City with full service history. Single owner, always garaged. Premium sedan with excellent mileage and comfort.",
    features: ["Sunroof", "Touchscreen Infotainment", "Rear Camera", "LED Headlights", "Cruise Control", "Keyless Entry", "Push Button Start", "Alloy Wheels", "Auto AC", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Good | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.2/10",
    serviceHistory: "All services done at authorized Honda dealership. Last service Dec 2024. New tyres fitted Nov 2024.",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Hyundai Creta 2024 SX(O)",
    brand: "Hyundai",
    model: "Creta",
    year: 2024,
    price: 1850000,
    city: "Mumbai",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 8000,
    ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Brand new shape Creta with ADAS, panoramic sunroof and ventilated seats. Top variant with all features loaded.",
    features: ["Panoramic Sunroof", "ADAS Level 2", "Ventilated Seats", "Bose Sound System", "Wireless Charging", "360 Camera", "Dual Zone AC", "Digital Key", "Rear AC Vents", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.7/10",
    serviceHistory: "Under Hyundai warranty. First free service completed.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Toyota Fortuner 2022 Legender 4x4",
    brand: "Toyota",
    model: "Fortuner",
    year: 2022,
    price: 4200000,
    city: "Delhi",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 18000,
    ownership: "1st Owner",
    registrationState: "Delhi",
    description: "Premium Fortuner Legender with dual-tone design. Powerful 2.8L diesel with 4x4 capability. Commanding road presence.",
    features: ["JBL Sound System", "Wireless Charging", "Kick Sensor Tailgate", "Cooled Seats", "360 Camera", "Terrain Modes", "7 Seats", "LED DRLs", "Connected Car", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.8/10",
    serviceHistory: "Toyota authorized service center. Complete service history available.",
    images: [
      "https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Tata Nexon EV 2023 Max LR",
    brand: "Tata",
    model: "Nexon EV",
    year: 2023,
    price: 1750000,
    city: "Pune",
    fuelType: "Electric",
    transmission: "Automatic",
    kilometers: 8000,
    ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Long range Nexon EV with 437km range. Zero emission, fast charging capable. 5-star Global NCAP safety rated.",
    features: ["Connected Car", "Ventilated Seats", "Sunroof", "Air Purifier", "Fast Charging", "Regenerative Braking", "Drive Modes", "Wireless Charging", "JBL Speakers", "6 Airbags"],
    inspectionReport: "Battery Health: 98% | Motor: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | Overall Score: 9.6/10",
    serviceHistory: "Tata authorized EV service center. Battery warranty active till 2031.",
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Mahindra XUV700 2023 AX7 L Diesel AT",
    brand: "Mahindra",
    model: "XUV700",
    year: 2023,
    price: 2350000,
    city: "Hyderabad",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 22000,
    ownership: "1st Owner",
    registrationState: "Telangana",
    description: "Feature-loaded XUV700 with ADAS Level 2, dual 10.25-inch screens and premium interiors. Best value-for-money SUV in India.",
    features: ["ADAS Level 2", "Dual 10.25\" Screens", "Alexa Built-in", "Panoramic Sunroof", "Flush Door Handles", "3D Sound by Sony", "Smart Door Handles", "Wireless Charging", "360 Camera", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Good | Suspension: Good | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.0/10",
    serviceHistory: "Mahindra authorized service. All scheduled services completed on time.",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Kia Seltos 2023 HTX+ Turbo",
    brand: "Kia",
    model: "Seltos",
    year: 2023,
    price: 1550000,
    city: "Chennai",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 15000,
    ownership: "1st Owner",
    registrationState: "Tamil Nadu",
    description: "Stylish Kia Seltos with 1.5L turbocharged petrol engine. Premium interiors with connected car features and segment-best ride quality.",
    features: ["10.25\" Touchscreen", "Bose Sound", "Ventilated Seats", "UVO Connected", "Sunroof", "LED Headlights", "Wireless Charger", "360 Camera", "Auto Headlamps", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Good | Brakes: Good | Electrical: Excellent | AC: Excellent | Overall Score: 9.1/10",
    serviceHistory: "Regular Kia authorized servicing. Warranty valid till 2028.",
    images: [
      "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Maruti Swift 2024 ZXI+ AGS",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2024,
    price: 950000,
    city: "Bangalore",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 5000,
    ownership: "1st Owner",
    registrationState: "Karnataka",
    description: "All-new 4th gen Swift with bold design and new Z-series engine. Best-in-class fuel efficiency at 25.75 kmpl. Fun to drive city car.",
    features: ["9\" Touchscreen", "Wireless CarPlay", "LED Headlights", "Auto AC", "Suzuki Connect", "Cruise Control", "Rear Parking Camera", "Push Start", "Steering Controls", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.5/10",
    serviceHistory: "Under Maruti warranty. Zero service required yet.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "BMW 3 Series 2022 320d M Sport",
    brand: "BMW",
    model: "3 Series",
    year: 2022,
    price: 3800000,
    city: "Mumbai",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 20000,
    ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "The ultimate driving machine. BMW 320d M Sport with aggressive styling, 190hp diesel engine and rear-wheel drive dynamics.",
    features: ["M Sport Package", "iDrive 7", "Harman Kardon Sound", "Ambient Lighting", "Gesture Control", "Heads-Up Display", "Adaptive LED", "Wireless Charging", "Digital Key", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.4/10",
    serviceHistory: "BMW authorized service. BSI package active. All services on schedule.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Mercedes-Benz C-Class 2023 C300d",
    brand: "Mercedes",
    model: "C-Class",
    year: 2023,
    price: 5500000,
    city: "Delhi",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 12000,
    ownership: "1st Owner",
    registrationState: "Delhi",
    description: "The all-new W206 C-Class with S-Class-inspired interior. 265hp diesel mild-hybrid powertrain with 9G-Tronic transmission.",
    features: ["MBUX Infotainment", "11.9\" Portrait Display", "Burmester Sound", "Digital Cockpit", "Ambient Lighting 64 Colors", "ADAS", "Air Suspension", "Wireless CarPlay", "360 Camera", "7 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.9/10",
    serviceHistory: "Mercedes-Benz Star Ease maintenance package. All services at authorized center.",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Audi Q5 2022 Technology",
    brand: "Audi",
    model: "Q5",
    year: 2022,
    price: 5800000,
    city: "Bangalore",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 15000,
    ownership: "1st Owner",
    registrationState: "Karnataka",
    description: "Luxury compact SUV with Quattro AWD. 2.0L TFSI turbo with 252hp. Virtual cockpit and premium B&O sound system.",
    features: ["Quattro AWD", "Virtual Cockpit", "B&O Sound System", "Matrix LED", "Panoramic Sunroof", "Powered Tailgate", "Wireless Charging", "Air Quality Package", "Park Assist", "8 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.5/10",
    serviceHistory: "Audi authorized service. Service plan active till 2027.",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Tata Harrier 2023 XZA+ Dark Edition",
    brand: "Tata",
    model: "Harrier",
    year: 2023,
    price: 2100000,
    city: "Pune",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 18000,
    ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "Bold and beautiful Harrier Dark Edition on Land Rover D8 platform. Commanding road presence with 5-star Global NCAP safety.",
    features: ["Panoramic Sunroof", "JBL 9-Speaker", "Connected Car", "Terrain Response", "Auto Park Assist", "Powered Driver Seat", "Wireless Charging", "360 Camera", "LED DRLs", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Good | Suspension: Good | Brakes: Good | Electrical: Excellent | AC: Excellent | Overall Score: 8.8/10",
    serviceHistory: "Tata authorized service center. All maintenance records available digitally.",
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Volkswagen Virtus 2023 GT Plus TSI",
    brand: "Volkswagen",
    model: "Virtus",
    year: 2023,
    price: 1750000,
    city: "Bangalore",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 10000,
    ownership: "1st Owner",
    registrationState: "Karnataka",
    description: "German engineering meets Indian roads. Virtus GT with 1.5L TSI turbo engine delivers 150hp and thrilling driving dynamics.",
    features: ["Virtual Cockpit", "Wireless CarPlay", "Ventilated Seats", "Sunroof", "My Volkswagen Connect", "Auto Dimming Mirror", "Rain Sensing Wipers", "Cruise Control", "6 Airbags", "ESC"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.4/10",
    serviceHistory: "All services at VW authorized center. Extended warranty active.",
    images: [
      "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Hyundai i20 2023 Asta(O) Turbo",
    brand: "Hyundai",
    model: "i20",
    year: 2023,
    price: 1150000,
    city: "Kolkata",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 9000,
    ownership: "1st Owner",
    registrationState: "West Bengal",
    description: "Premium hatchback with segment-best features. Turbo DCT with 120hp. Sunroof, BlueLink connected tech and sportier N Line-inspired design.",
    features: ["Sunroof", "BlueLink Connected", "Bose Premium Sound", "10.25\" Infotainment", "Digital Cluster", "Wireless Charging", "Air Purifier", "LED Package", "Auto Headlamps", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.3/10",
    serviceHistory: "Hyundai authorized service. Complete digital history on BlueLink app.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Toyota Innova Hycross 2023 ZX(O) Hybrid",
    brand: "Toyota",
    model: "Innova Hycross",
    year: 2023,
    price: 2800000,
    city: "Chennai",
    fuelType: "Hybrid",
    transmission: "Automatic",
    kilometers: 20000,
    ownership: "1st Owner",
    registrationState: "Tamil Nadu",
    description: "Revolutionary Innova Hycross with strong hybrid powertrain delivering 21 kmpl. Premium MPV with captain seats and ottoman function.",
    features: ["Strong Hybrid", "Ottoman Seats", "Panoramic Sunroof", "JBL Sound System", "Digital Rearview Mirror", "Powered Tailgate", "Wireless Charging", "T-Connect", "9\" Touchscreen", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Hybrid System: Excellent | Suspension: Good | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.3/10",
    serviceHistory: "Toyota authorized service. Hybrid battery warranty till 2031.",
    images: [
      "https://images.unsplash.com/photo-1621993202323-f438eec934ff?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Mahindra Thar 2023 LX Hard Top Diesel AT",
    brand: "Mahindra",
    model: "Thar",
    year: 2023,
    price: 1800000,
    city: "Jaipur",
    fuelType: "Diesel",
    transmission: "Automatic",
    kilometers: 12000,
    ownership: "1st Owner",
    registrationState: "Rajasthan",
    description: "Iconic off-roader with 2.2L mHawk diesel and 4x4 capability. Hard-top version with improved NVH and creature comforts.",
    features: ["4x4 with Low Range", "Hard Top", "9\" Touchscreen", "Drizzle LED Headlamps", "Cruise Control", "Tyre Pressure Monitor", "Adventure Statistics", "Rear Camera", "AdrenoX Connected", "2 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | 4x4 System: Excellent | Suspension: Excellent | Brakes: Good | Overall Score: 9.0/10",
    serviceHistory: "Mahindra authorized service. Off-road use: minimal. City driven mostly.",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Honda Elevate 2024 ZX CVT",
    brand: "Honda",
    model: "Elevate",
    year: 2024,
    price: 1650000,
    city: "Delhi",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 6000,
    ownership: "1st Owner",
    registrationState: "Delhi",
    description: "Honda's global SUV for India. 1.5L i-VTEC with Honda Sensing ADAS. Best-in-class rear seat space and ride comfort.",
    features: ["Honda Sensing ADAS", "Honda Connect", "Sunroof", "Wireless Charging", "8\" Touchscreen", "Lane Keep Assist", "Adaptive Cruise", "LED Headlights", "Rear Parking Camera", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.4/10",
    serviceHistory: "Honda authorized dealer. Under warranty with free services remaining.",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "MG Hector 2023 Sharp Pro CVT",
    brand: "MG",
    model: "Hector",
    year: 2023,
    price: 1950000,
    city: "Ahmedabad",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 14000,
    ownership: "1st Owner",
    registrationState: "Gujarat",
    description: "Internet SUV with i-SMART 2.0 connected tech. Massive 14-inch HD portrait touchscreen. Spacious cabin with premium feel.",
    features: ["14\" Portrait Touchscreen", "i-SMART 2.0", "Panoramic Sunroof", "Infinity Sound", "Wireless Charging", "Front Parking Sensors", "ADAS", "Powered Tailgate", "Ventilated Seats", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Good | Suspension: Good | Brakes: Good | Electrical: Excellent | AC: Excellent | Overall Score: 8.9/10",
    serviceHistory: "MG authorized workshops. All services on time. Extended warranty active.",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Kia Sonet 2023 HTX+ Diesel iMT",
    brand: "Kia",
    model: "Sonet",
    year: 2023,
    price: 1250000,
    city: "Hyderabad",
    fuelType: "Diesel",
    transmission: "Manual",
    kilometers: 18000,
    ownership: "1st Owner",
    registrationState: "Telangana",
    description: "Compact SUV with powerful 1.5L diesel engine. iMT clutchless manual for best of both worlds. Feature-loaded with Bose sound.",
    features: ["10.25\" Touchscreen", "Bose Sound", "Sunroof", "UVO Connected", "Ventilated Seats", "LED Headlights", "Wireless Charger", "Rear Camera", "Air Purifier", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Good | Suspension: Good | Brakes: Good | Electrical: Excellent | AC: Excellent | Overall Score: 8.7/10",
    serviceHistory: "Kia authorized service. 5 year warranty still active.",
    images: [
      "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Maruti Baleno 2023 Alpha AMT",
    brand: "Maruti Suzuki",
    model: "Baleno",
    year: 2023,
    price: 920000,
    city: "Lucknow",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 16000,
    ownership: "1st Owner",
    registrationState: "Uttar Pradesh",
    description: "Premium NEXA hatchback with spacious interiors and great fuel efficiency. Heads-up display and 360-degree view camera in top variant.",
    features: ["HUD", "360 View Camera", "9\" Touchscreen", "Arkamys Sound", "Auto AC", "Suzuki Connect", "LED Projector Lights", "Cruise Control", "Rear AC Vents", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Good | Suspension: Good | Brakes: Good | Electrical: Good | AC: Good | Overall Score: 8.8/10",
    serviceHistory: "Regular servicing at NEXA dealership. All records available.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
  {
    title: "Skoda Slavia 2023 Style 1.5 TSI AT",
    brand: "Skoda",
    model: "Slavia",
    year: 2023,
    price: 1650000,
    city: "Mumbai",
    fuelType: "Petrol",
    transmission: "Automatic",
    kilometers: 11000,
    ownership: "1st Owner",
    registrationState: "Maharashtra",
    description: "European sedan with 150hp turbo-petrol and DSG gearbox. Best-in-class driving dynamics and build quality. Spacious rear seat.",
    features: ["10\" Touchscreen", "Wireless SmartLink", "Ventilated Seats", "Sunroof", "My Skoda App", "Auto Headlamps", "Cruise Control", "Rear Camera", "Rain Sensing Wipers", "6 Airbags"],
    inspectionReport: "Engine: Excellent | Transmission: Excellent | Suspension: Excellent | Brakes: Excellent | Electrical: Excellent | AC: Excellent | Overall Score: 9.2/10",
    serviceHistory: "Skoda authorized service center. 4 year service package active.",
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=664&h=374&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=664&h=374&fit=crop&auto=format&q=80",
    ],
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!\n");

    // Remove existing cars (optional — keeps the Honda Elevate if you want)
    const existingCount = await Car.countDocuments();
    console.log(`Existing cars in DB: ${existingCount}`);

    // Clear all existing cars and insert fresh demo data
    await Car.deleteMany({});
    console.log("Cleared existing cars.\n");

    // Insert all demo cars
    const inserted = await Car.insertMany(demoCars);
    console.log(`Inserted ${inserted.length} demo cars:\n`);

    inserted.forEach((car: any, i: number) => {
      console.log(`  ${i + 1}. ${car.title}`);
      console.log(`     ${car.brand} | ${car.city} | ${car.fuelType} | ₹${(car.price / 100000).toFixed(1)}L | ${car.images.length} images`);
    });

    console.log(`\n✅ Done! ${inserted.length} cars are now in the database.`);
    console.log("Visit http://localhost:3000/cars to see them.\n");

    await mongoose.disconnect();
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seed();

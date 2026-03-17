/**
 * FIX CAR IMAGES SCRIPT
 *
 * Scans all car records in the database, checks if image URLs are accessible,
 * and replaces broken images (404s) with working Unsplash alternatives
 * matched by car brand.
 *
 * Run: npx tsx lib/fixCarImages.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carplatform";

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

// ---------------------------------------------------------------------------
// Brand-matched Unsplash image mapping
// Each brand has 2 verified working images (primary + secondary angle)
// All URLs verified to return HTTP 200 as of March 2026
// Format: ?w=664&h=374&fit=crop matches the original aeplcdn dimensions
// ---------------------------------------------------------------------------
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=664&h=374&fit=crop&auto=format&q=80`;

const brandImages: Record<string, string[]> = {
  // Honda — white sedan / Honda on road
  Honda: [
    IMG("photo-1609521263047-f8f205293f24"),
    IMG("photo-1619405399517-d7fce0f13302"),
  ],
  // Hyundai — modern SUV / silver SUV
  Hyundai: [
    IMG("photo-1580273916550-e323be2ae537"),
    IMG("photo-1616422285623-13ff0162193c"),
  ],
  // Toyota — large SUV / dark SUV
  Toyota: [
    IMG("photo-1621993202323-f438eec934ff"),
    IMG("photo-1617814076367-b759c7d7e738"),
  ],
  // Tata — compact SUV style / dark crossover
  Tata: [
    IMG("photo-1619767886558-efdc259cde1a"),
    IMG("photo-1614200187524-dc4b892acf16"),
  ],
  // Mahindra — off-road SUV / rugged SUV
  Mahindra: [
    IMG("photo-1563720223185-11003d516935"),
    IMG("photo-1570733577524-3a047079e80d"),
  ],
  // Kia — modern crossover / sporty SUV
  Kia: [
    IMG("photo-1612825173281-9a193378527e"),
    IMG("photo-1626668011687-8a114cf5a34c"),
  ],
  // Maruti Suzuki — compact hatchback / city car
  "Maruti Suzuki": [
    IMG("photo-1549399542-7e3f8b79c341"),
    IMG("photo-1511919884226-fd3cad34687c"),
  ],
  // BMW — luxury sedan / BMW M sport
  BMW: [
    IMG("photo-1555215695-3004980ad54e"),
    IMG("photo-1553440569-bcc63803a83d"),
  ],
  // Mercedes — luxury sedan / Mercedes SUV
  Mercedes: [
    IMG("photo-1618843479313-40f8afb4b4d8"),
    IMG("photo-1617531653332-bd46c24f2068"),
  ],
  // Audi — Audi front / Audi sporty
  Audi: [
    IMG("photo-1606664515524-ed2f786a0bd6"),
    IMG("photo-1542362567-b07e54358753"),
  ],
  // Volkswagen — VW sedan / European car
  Volkswagen: [
    IMG("photo-1580414057403-c5f451f30e1c"),
    IMG("photo-1502877338535-766e1452684a"),
  ],
  // MG — modern SUV / crossover
  MG: [
    IMG("photo-1544636331-e26879cd4d9b"),
    IMG("photo-1590362891991-f776e747a588"),
  ],
  // Skoda — European sedan / elegant car
  Skoda: [
    IMG("photo-1541899481282-d53bffe3c35d"),
    IMG("photo-1526726538690-5cbf956ae2fd"),
  ],
};

// Fallback images for any brand not in the mapping
const fallbackImages = [
  IMG("photo-1494976388531-d1058494cdd8"),
  IMG("photo-1503376780353-7e6692767b70"),
];

// ---------------------------------------------------------------------------
// Check if a URL is accessible (returns true if HTTP 200)
// ---------------------------------------------------------------------------
async function isUrlAccessible(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main fix function
// ---------------------------------------------------------------------------
async function fixImages() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!\n");

  const cars = await Car.find({}).lean();
  console.log(`📦 Found ${cars.length} cars in database.\n`);

  let totalImages = 0;
  let brokenImages = 0;
  let fixedCars = 0;

  for (const car of cars as any[]) {
    const carLabel = `[${car.brand} ${car.model}] ${car.title}`;
    const images: string[] = car.images || [];
    totalImages += images.length;

    if (images.length === 0) {
      console.log(`⚠️  ${carLabel} — no images at all, adding brand images`);
      const newImages = brandImages[car.brand] || fallbackImages;
      await Car.updateOne({ _id: car._id }, { $set: { images: newImages } });
      fixedCars++;
      brokenImages++;
      console.log(`   ✅ Added ${newImages.length} new images\n`);
      continue;
    }

    let needsUpdate = false;
    const newImages: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const url = images[i];
      const accessible = await isUrlAccessible(url);

      if (accessible) {
        // Also check if Next.js can optimize it — aeplcdn blocks Next.js even if curl works
        const isProblematicDomain =
          url.includes("imgd.aeplcdn.com") ||
          url.includes("stimg.cardekho.com");

        if (isProblematicDomain) {
          console.log(
            `   🔄 Image ${i + 1}: ${url.substring(0, 60)}... — hotlink-protected domain, replacing`
          );
          const replacements = brandImages[car.brand] || fallbackImages;
          newImages.push(replacements[i % replacements.length]);
          needsUpdate = true;
          brokenImages++;
        } else {
          newImages.push(url);
        }
      } else {
        console.log(
          `   ❌ Image ${i + 1}: ${url.substring(0, 60)}... — HTTP 404/unreachable`
        );
        const replacements = brandImages[car.brand] || fallbackImages;
        newImages.push(replacements[i % replacements.length]);
        needsUpdate = true;
        brokenImages++;
      }
    }

    if (needsUpdate) {
      console.log(`   🔧 ${carLabel}`);
      await Car.updateOne({ _id: car._id }, { $set: { images: newImages } });
      fixedCars++;
      console.log(`   ✅ Replaced with ${newImages.length} working images\n`);
    } else {
      console.log(`   ✅ ${carLabel} — all images OK`);
    }
  }

  // ---------------------------------------------------------------------------
  // Verification pass — re-read all cars and confirm every image loads
  // ---------------------------------------------------------------------------
  console.log("\n" + "=".repeat(60));
  console.log("🔍 VERIFICATION PASS — checking all images in database...\n");

  const updatedCars = await Car.find({}).lean();
  let allGood = true;

  for (const car of updatedCars as any[]) {
    for (const url of car.images || []) {
      const ok = await isUrlAccessible(url);
      if (!ok) {
        console.log(`   ❌ STILL BROKEN: ${car.title} — ${url}`);
        allGood = false;
      }
    }
  }

  if (allGood) {
    console.log("✅ All images verified — every URL returns HTTP 200!\n");
  } else {
    console.log("⚠️  Some images still broken — check logs above.\n");
  }

  // Summary
  console.log("=".repeat(60));
  console.log("📊 SUMMARY");
  console.log(`   Total cars:       ${cars.length}`);
  console.log(`   Total images:     ${totalImages}`);
  console.log(`   Broken/replaced:  ${brokenImages}`);
  console.log(`   Cars updated:     ${fixedCars}`);
  console.log("=".repeat(60));

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB. Done!");
}

fixImages().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Car from "@/models/Car";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://car-kharedo.vercel.app/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/car-request`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/wishlist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Fetch cars directly from DB during build to avoid relying on an external API URL
  try {
    await connectDB();
    const cars = await Car.find({}).lean();
    const carRoutes: MetadataRoute.Sitemap = cars.map((car: any) => ({
      url: `${base}/cars/${car._id}`,
      lastModified: new Date(car.updatedAt || car.createdAt),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticPages, ...carRoutes];
  } catch (err) {
    // On failure, just return static pages so build doesn't fail
    console.error("Failed to generate sitemap dynamic routes:", err);
    return staticPages;
  }
}

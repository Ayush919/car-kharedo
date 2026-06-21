import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Car from "@/models/Car";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://car-kharedo.vercel.app");

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/car-request`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/wishlist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Fetch cars directly from DB during build to avoid relying on an external API URL
  try {
    await connectDB();
    const cars = await Car.find({}).lean();
    const carRoutes: MetadataRoute.Sitemap = cars.map((car: any) => ({
      url: `${baseUrl}/cars/${car._id}`,
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

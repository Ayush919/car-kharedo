/**
 * CAR LISTING PAGE — /cars
 *
 * DATA FLOW:
 *   1. Admin adds car via /admin/add-car form
 *   2. Car stored in MongoDB "cars" collection via POST /api/cars/create
 *   3. This page's CarListGrid component fetches GET /api/cars
 *   4. API reads from MongoDB and returns car list as JSON
 *   5. Cars rendered using CarCard component
 *
 * The car appears here automatically after being added — no manual refresh needed.
 *
 * WHERE TO CHECK:
 *   - This page: http://localhost:3000/cars
 *   - API: http://localhost:3000/api/cars
 *   - Database: MongoDB → carplatform → cars collection
 */
import { Suspense } from "react";
import CarFilters from "@/components/CarFilters";
import CarListGrid from "./CarListGrid";
import { Metadata } from "next";

// prefer NEXT_PUBLIC_SITE_URL, then VERCEL_URL during Vercel builds, then hardcoded fallback
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.carkharedo.com");

export const metadata: Metadata = {
  title: "Used Cars for Sale - Browse Certified Pre-Owned Cars | carKharedo",
  description:
    "Explore a wide selection of certified used cars for sale on carKharedo. Filter by city, budget, brand, fuel type, and more to find your perfect pre-owned vehicle.",
  keywords: [
    "used cars for sale",
    "buy used cars",
    "certified pre-owned cars",
    "second hand cars",
    "car listings",
    "car marketplace",
    "used car deals",
  ],
  openGraph: {
    title: "Used Cars for Sale - Browse Certified Pre-Owned Cars | carKharedo",
    description:
      "Explore a wide selection of certified used cars for sale on carKharedo. Filter by city, budget, brand, fuel type, and more to find your perfect pre-owned vehicle.",
    url: `${baseUrl}/cars`,
    images: [
      {
        url: `${baseUrl}/og-image-cars.jpg`, // Specific OG image for cars listing
        width: 1200,
        height: 630,
        alt: "Used Cars for Sale on carKharedo",
      },
    ],
  },
  twitter: {
    title: "Used Cars for Sale - Browse Certified Pre-Owned Cars | carKharedo",
    description:
      "Explore a wide selection of certified used cars for sale on carKharedo. Filter by city, budget, brand, fuel type, and more to find your perfect pre-owned vehicle.",
    images: [`${baseUrl}/twitter-image-cars.jpg`], // Specific Twitter image for cars listing
  },
  alternates: {
    canonical: `${baseUrl}/cars`,
  },
};

export default function CarsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Used Cars",
        item: `${baseUrl}/cars`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container-custom py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Buy Used Cars</h1>
          <p className="text-sm text-gray-500">
            Find your perfect certified pre-owned car
          </p>
        </div>
        <div className="flex gap-6">
          <Suspense fallback={null}>
            <CarFilters />
          </Suspense>
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="space-y-3 p-4">
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-3 w-1/2 rounded bg-gray-200" />
                        <div className="h-5 w-1/3 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <CarListGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

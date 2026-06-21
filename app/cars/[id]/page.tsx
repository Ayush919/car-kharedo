import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import CarModel from "@/models/Car";
import CarDetails from "@/components/CarDetails";
import RecentlyViewedTracker from "./RecentlyViewedTracker";
import type { Metadata } from "next";
import type { ICar } from "@/types";
import { formatPrice, formatKilometers } from "@/lib/utils"; // Assuming these are available

interface Props {
  params: { id: string };
}

async function getCar(id: string): Promise<ICar | null> {
  try {
    await connectDB();
    const car = await CarModel.findById(id).lean();
    if (!car) return null;
    return JSON.parse(JSON.stringify(car));
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const car: ICar | null = await getCar(id);

  if (!car) {
    return {
      title: "Car Not Found - carKharedo",
      description: "The car you are looking for does not exist.",
    };
  }

  const carTitle = `${car.year} ${car.brand} ${car.model} for sale in ${car.city} | carKharedo`;
  const carDescription =
    car.description ||
    `Buy this certified pre-owned ${car.year} ${car.brand} ${car.model} in ${car.city} for ${formatPrice(car.price)}. Features include ${car.fuelType} fuel type and ${formatKilometers(car.kilometers)} driven.`;
  const carKeywords = [
    `${car.brand} ${car.model}`,
    `used ${car.brand} ${car.model}`,
    `second hand ${car.brand} ${car.model}`,
    `${car.brand} cars in ${car.city}`,
    `used cars ${car.city}`,
    "certified pre-owned cars",
    "carKharedo",
    car.fuelType,
    car.transmission,
    car.year.toString(),
  ].join(", ");

  const imageUrl = car.images?.[0] || "https://www.carkharedo.com/og-image-default.jpg"; // Default OG image

  return {
    title: carTitle,
    description: carDescription,
    keywords: carKeywords,
    openGraph: {
      title: carTitle,
      description: carDescription,
      url: `https://www.carkharedo.com/cars/${car._id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: carTitle,
        },
      ],
      // Next's built-in OpenGraph type validation does not accept "product" here.
      // Use a supported type such as "website" (or omit the field) to avoid the runtime error.
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: carTitle,
      description: carDescription,
      images: [imageUrl],
      creator: "@carkharedo",
    },
    alternates: {
      canonical: `https://www.carkharedo.com/cars/${car._id}`,
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = params;
  const car: ICar | null = await getCar(id);

  if (!car) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.carkharedo.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Used Cars",
        item: "https://www.carkharedo.com/cars",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: car.title,
        item: `https://www.carkharedo.com/cars/${car._id}`,
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.title,
    description: car.description || `Used ${car.brand} ${car.model} for sale in ${car.city}.`,
    image: car.images?.[0] || "https://www.carkharedo.com/placeholder-car.svg",
    sku: car._id, // Using _id as SKU, if no specific SKU exists
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://www.carkharedo.com/cars/${car._id}`,
      priceCurrency: "INR", // Assuming Indian Rupees
      price: car.price,
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock", // Assuming it's in stock if displayed
      seller: {
        "@type": "Organization",
        name: "carKharedo",
      },
    },
    vehicleConfiguration: {
      "@type": "Car",
      model: car.model,
      productionDate: car.year ? `${car.year}-01-01` : undefined, // Assuming year is production year
      fuelType: car.fuelType,
      mileageFromOdometer: {
        "@type": "QuantitativeValue",
        value: car.kilometers,
        unitCode: "KM",
      },
      // Add more properties if available: engine, transmission, color, etc.
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <RecentlyViewedTracker carId={car._id} />
      <CarDetails car={car} />
    </>
  );
}

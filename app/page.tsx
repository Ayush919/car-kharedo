import Link from "next/link";
import Image from "next/image";
import {ArrowRight, Award, Calendar, Car, CheckCircle2, Fuel, Gauge, MapPin, Shield, Star, Wrench,} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import {connectDB} from "@/lib/mongodb";
import CarModel from "@/models/Car";
import {formatKilometers, formatPrice} from "@/lib/utils";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Buy & Sell Used Cars - India's Most Trusted Platform | carKharedo",
    description:
        "India's most trusted platform for buying and selling used cars. Find the best deals on certified pre-owned cars in your city. 200+ quality checks, free RC transfer, 1-year warranty.",
    keywords: [
        "used cars India",
        "buy second hand cars",
        "sell used cars",
        "pre-owned cars",
        "certified used cars",
        "car marketplace India",
        "best car deals",
        "car prices India",
    ],
    openGraph: {
        title: "Buy & Sell Used Cars - India's Most Trusted Platform | carKharedo",
        description:
            "India's most trusted platform for buying and selling used cars. Find the best deals on certified pre-owned cars in your city. 200+ quality checks, free RC transfer, 1-year warranty.",
        url: "https://www.carkharedo.com",
        images: [
            {
                url: "https://www.carkharedo.com/og-image-home.jpg", // Specific OG image for home
                width: 1200,
                height: 630,
                alt: "carKharedo - Buy & Sell Used Cars",
            },
        ],
    },
    twitter: {
        title: "Buy & Sell Used Cars - India's Most Trusted Platform | carKharedo",
        description:
            "India's most trusted platform for buying and selling used cars. Find the best deals on certified pre-owned cars in your city. 200+ quality checks, free RC transfer, 1-year warranty.",
        images: ["https://www.carkharedo.com/twitter-image-home.jpg"], // Specific Twitter image for home
    },
    alternates: {
        canonical: "https://www.carkharedo.com",
    },
};

const cities = [
    {name: "Delhi", count: "500+"},
    {name: "Mumbai", count: "450+"},
    {name: "Bangalore", count: "380+"},
    {name: "Hyderabad", count: "320+"},
    {name: "Chennai", count: "290+"},
    {name: "Pune", count: "260+"},
    {name: "Kolkata", count: "220+"},
    {name: "Ahmedabad", count: "180+"},
];

const budgetFilters = [
    {label: "Under 5 Lakh", min: 0, max: 500000},
    {label: "5-10 Lakh", min: 500000, max: 1000000},
    {label: "10-15 Lakh", min: 1000000, max: 1500000},
    {label: "15-20 Lakh", min: 1500000, max: 2000000},
    {label: "20-30 Lakh", min: 2000000, max: 3000000},
    {label: "Above 30 Lakh", min: 3000000, max: 0},
];

// Force dynamic rendering - don't try to connect to MongoDB during build
export const dynamic = "force-dynamic";

async function getPopularCars() {
    try {
        await connectDB();
        const cars = await CarModel.find().sort({createdAt: -1}).limit(6).lean();
        // Safely handle undefined/null data — prevents "Cannot read properties of undefined"
        if (!cars || !Array.isArray(cars)) return [];
        return JSON.parse(JSON.stringify(cars));
    } catch (err) {
        console.log("[Home] Could not fetch cars:", (err as any)?.message);
        return [];
    }
}

export default async function HomePage() {
    const popularCars = await getPopularCars();

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "carKharedo",
        url: "https://www.carkharedo.com",
        logo: "https://www.carkharedo.com/logo.png", // Replace with your actual logo
        sameAs: [
            "https://www.facebook.com/carkharedo", // Replace with your social media links
            "https://twitter.com/carkharedo",
            "https://www.instagram.com/carkharedo",
        ],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "carKharedo",
        url: "https://www.carkharedo.com",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://www.carkharedo.com/cars?search={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}}
            />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"/>
                <div className="container-custom relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                            Find Your <span className="text-primary-400">Perfect</span> Car
                        </h1>
                        <p className="mb-8 text-lg text-gray-300">
                            India&apos;s most trusted platform for buying certified pre-owned
                            cars. Every car inspected, certified, and delivered to your
                            doorstep.
                        </p>
                        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                            <SearchBar/>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-400"/>
                200+ Point Inspection
              </span>
                            <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-400"/>
                Free RC Transfer
              </span>
                            <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-400"/>
                1 Year Warranty
              </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search by City */}
            <section className="py-16">
                <div className="container-custom">
                    <h2 className="mb-2 text-center text-2xl font-bold">
                        Search Cars by City
                    </h2>
                    <p className="mb-8 text-center text-gray-500">
                        Find certified used cars available in your city
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                        {cities.map((city) => (
                            <Link
                                key={city.name}
                                href={`/cars?city=${city.name}`}
                                className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md"
                            >
                                <div
                                    className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100">
                                    <MapPin className="h-6 w-6"/>
                                </div>
                                <span className="text-sm font-semibold">{city.name}</span>
                                <span className="text-xs text-gray-400">{city.count} cars</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Budget Filter Section */}
            <section className="bg-gray-50 py-16">
                <div className="container-custom">
                    <h2 className="mb-2 text-center text-2xl font-bold">
                        Shop by Budget
                    </h2>
                    <p className="mb-8 text-center text-gray-500">
                        Find the perfect car that fits your budget
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {budgetFilters.map((bf) => (
                            <Link
                                key={bf.label}
                                href={`/cars?budgetMin=${bf.min}${bf.max ? `&budgetMax=${bf.max}` : ""}`}
                                className="group rounded-xl border border-gray-200 bg-white p-5 text-center transition-all hover:border-primary-300 hover:shadow-md"
                            >
                                <div className="mb-2 text-2xl font-bold text-primary-500 group-hover:text-primary-600">
                                    {bf.label.split(" ")[0] === "Under" ? "<5L" : bf.label.split(" ")[0] === "Above" ? ">30L" : bf.label.split(" ")[0]}
                                </div>
                                <span className="text-sm text-gray-600">{bf.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Cars */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Popular Cars</h2>
                            <p className="text-gray-500">Handpicked cars for you</p>
                        </div>
                        <Link
                            href="/cars"
                            className="flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600"
                        >
                            View All <ArrowRight className="h-4 w-4"/>
                        </Link>
                    </div>
                    {popularCars.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {popularCars.map((car: any) => (
                                <Link
                                    key={car._id}
                                    href={`/cars/${car._id}`}
                                    className="card group"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                        <Image
                                            src={car.images?.[0] || "/placeholder-car.svg"}
                                            alt={`Used ${car.title} for sale`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute bottom-2 left-2">
                      <span className="rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-medium text-white">
                        {car.ownership}
                      </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 text-base font-semibold line-clamp-1">
                                            {car.title}
                                        </h3>
                                        <div
                                            className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5"/>
                          {car.year}
                      </span>
                                            <span className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5"/>
                                                {car.fuelType}
                      </span>
                                            <span className="flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5"/>
                                                {formatKilometers(car.kilometers)}
                      </span>
                                            <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5"/>
                                                {car.city}
                      </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(car.price)}
                      </span>
                                            <span
                                                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {car.transmission}
                      </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                            <Car className="mx-auto mb-4 h-12 w-12 text-gray-400"/>
                            <h3 className="mb-2 text-lg font-semibold text-gray-600">No Cars Yet</h3>
                            <p className="mb-4 text-sm text-gray-400">
                                Seed the database to see cars here.
                            </p>
                            <p className="text-xs text-gray-400">
                                Visit <code className="rounded bg-gray-200 px-2 py-0.5">/api/seed</code> (POST)
                                or run <code className="rounded bg-gray-200 px-2 py-0.5">npm run seed</code>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Latest Cars */}
            <section className="bg-gray-50 py-16">
                <div className="container-custom">
                    <h2 className="mb-2 text-center text-2xl font-bold">
                        Latest Arrivals
                    </h2>
                    <p className="mb-8 text-center text-gray-500">
                        Fresh stock just added to our inventory
                    </p>
                    {popularCars.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {popularCars.slice(0, 6).map((car: any) => (
                                <Link
                                    key={car._id}
                                    href={`/cars/${car._id}`}
                                    className="group rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-md"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <Image
                                            src={car.images?.[0] || "/placeholder-car.svg"}
                                            alt={`Latest arrival: ${car.title}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 50vw, 16vw"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-xs font-semibold line-clamp-1">{car.title}</h3>
                                        <p className="text-sm font-bold text-primary-600">{formatPrice(car.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16">
                <div className="container-custom">
                    <h2 className="mb-2 text-center text-2xl font-bold">
                        Why Choose carKharedo
                    </h2>
                    <p className="mb-10 text-center text-gray-500">
                        Your trust is our priority
                    </p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: Shield,
                                title: "200+ Quality Checks",
                                desc: "Every car undergoes thorough multi-point inspection by certified mechanics",
                            },
                            {
                                icon: Award,
                                title: "Certified Cars Only",
                                desc: "Only the best quality cars make it to our platform. Refurbished to perfection",
                            },
                            {
                                icon: Wrench,
                                title: "Free Service History",
                                desc: "Get complete maintenance records and service history of every car",
                            },
                            {
                                icon: Star,
                                title: "1 Year Warranty",
                                desc: "Comprehensive warranty covering engine, transmission, and more",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-primary-300 hover:shadow-md"
                            >
                                <div
                                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100">
                                    <item.icon className="h-7 w-7"/>
                                </div>
                                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-500 py-16">
                <div className="container-custom text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">
                        Ready to Find Your Dream Car?
                    </h2>
                    <p className="mb-8 text-lg text-primary-100">
                        Browse thousands of certified cars at the best prices
                    </p>
                    <Link
                        href="/cars"
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-sm font-semibold text-primary-600 transition-colors hover:bg-gray-100"
                    >
                        Browse All Cars
                        <ArrowRight className="h-4 w-4"/>
                    </Link>
                </div>
            </section>
        </div>

    );
}

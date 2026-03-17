"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Fuel, Gauge, Calendar, MapPin, GitCompare } from "lucide-react";
import { ICar } from "@/types";
import { formatPrice, formatKilometers } from "@/lib/utils";
import { useHydratedCarStore } from "@/stores/useCarStore";

interface CarCardProps {
  car: ICar;
}

export default function CarCard({ car }: CarCardProps) {
  const { wishlist, toggleWishlist, compareCars, toggleCompare } = useHydratedCarStore();
  const isWishlisted = wishlist.includes(car._id);
  const isComparing = compareCars.includes(car._id);

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={`/cars/${car._id}`}>
          <Image
            src={car.images?.[0] || "/placeholder-car.svg"}
            alt={car.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Action buttons */}
        <div className="absolute right-2 top-2 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(car._id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
            title="Add to Wishlist"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(car._id);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
              isComparing
                ? "bg-primary-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
            }`}
            title="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>

        {/* Ownership badge */}
        <div className="absolute bottom-2 left-2">
          <span className="rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-medium text-white">
            {car.ownership}
          </span>
        </div>
      </div>

      {/* Details */}
      <Link href={`/cars/${car._id}`} className="block p-4">
        <h3 className="mb-1 text-base font-semibold text-gray-900 line-clamp-1">
          {car.title}
        </h3>

        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {car.year}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {formatKilometers(car.kilometers)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {car.city}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(car.price)}
          </span>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {car.transmission}
          </span>
        </div>
      </Link>
    </div>
  );
}

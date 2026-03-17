"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useHydratedCarStore } from "@/stores/useCarStore";
import CarCard from "@/components/CarCard";
import { ICar } from "@/types";

export default function WishlistPage() {
  const { wishlist } = useHydratedCarStore();
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistCars() {
      if (wishlist.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }

      try {
        const promises = wishlist.map((id) =>
          fetch(`/api/cars/${id}`).then((r) => (r.ok ? r.json() : null))
        );
        const results = await Promise.all(promises);
        setCars(results.filter(Boolean));
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchWishlistCars();
  }, [wishlist]);

  return (
    <div className="container-custom py-8">
      <h1 className="mb-2 text-2xl font-bold">My Wishlist</h1>
      <p className="mb-6 text-sm text-gray-500">
        {wishlist.length} car{wishlist.length !== 1 ? "s" : ""} saved
      </p>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-5 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-20">
          <Heart className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            Your wishlist is empty
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Browse cars and click the heart icon to save them here
          </p>
          <a href="/cars" className="btn-primary text-sm">
            Browse Cars
          </a>
        </div>
      )}
    </div>
  );
}

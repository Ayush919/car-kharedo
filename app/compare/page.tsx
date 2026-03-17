"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GitCompare, X, Trash2 } from "lucide-react";
import { useHydratedCarStore } from "@/stores/useCarStore";
import { ICar } from "@/types";
import { formatPrice, formatKilometers } from "@/lib/utils";

export default function ComparePage() {
  const { compareCars, toggleCompare, clearCompare } = useHydratedCarStore();
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      if (compareCars.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }
      try {
        const promises = compareCars.map((id) =>
          fetch(`/api/cars/${id}`).then((r) => (r.ok ? r.json() : null))
        );
        const results = await Promise.all(promises);
        setCars(results.filter(Boolean));
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [compareCars]);

  const compareFields = [
    { label: "Price", key: "price", format: (v: number) => formatPrice(v) },
    { label: "Year", key: "year" },
    { label: "Brand", key: "brand" },
    { label: "Model", key: "model" },
    { label: "Fuel Type", key: "fuelType" },
    { label: "Transmission", key: "transmission" },
    { label: "Kilometers", key: "kilometers", format: (v: number) => formatKilometers(v) },
    { label: "Ownership", key: "ownership" },
    { label: "City", key: "city" },
    { label: "Registration", key: "registrationState" },
  ];

  return (
    <div className="container-custom py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compare Cars</h1>
          <p className="text-sm text-gray-500">
            Compare up to 3 cars side by side
          </p>
        </div>
        {compareCars.length > 0 && (
          <button
            onClick={clearCompare}
            className="flex items-center gap-1 text-sm text-red-500 hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      ) : cars.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-40 bg-gray-50 p-4 text-left text-sm font-semibold text-gray-600">
                  Feature
                </th>
                {cars.map((car) => (
                  <th key={car._id} className="min-w-[200px] p-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(car._id)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="relative mx-auto mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={car.images?.[0] || "/placeholder-car.svg"}
                          alt={car.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                      <p className="text-sm font-semibold line-clamp-2">
                        {car.title}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field, idx) => (
                <tr
                  key={field.key}
                  className={idx % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {field.label}
                  </td>
                  {cars.map((car) => (
                    <td key={car._id} className="p-4 text-center text-sm font-semibold">
                      {field.format
                        ? field.format((car as any)[field.key])
                        : (car as any)[field.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Features comparison */}
              <tr>
                <td className="bg-gray-50 p-4 text-sm font-medium text-gray-600">
                  Features
                </td>
                {cars.map((car) => (
                  <td key={car._id} className="p-4">
                    <div className="space-y-1">
                      {car.features.slice(0, 8).map((f, i) => (
                        <span
                          key={i}
                          className="mr-1 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-20">
          <GitCompare className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            No cars to compare
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Add cars to compare by clicking the compare icon on car cards
          </p>
          <a href="/cars" className="btn-primary text-sm">
            Browse Cars
          </a>
        </div>
      )}
    </div>
  );
}

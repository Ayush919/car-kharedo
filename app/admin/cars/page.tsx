"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Car, Search } from "lucide-react";
import { ICar } from "@/types";
import { formatPrice } from "@/lib/utils";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 10;

export default function AdminCarsPage() {
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      setCars(data.cars || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchCars(), search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchCars]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      await fetch(`/api/cars/${id}`, { method: "DELETE" });
      fetchCars();
    } catch {
      alert("Failed to delete car");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Cars</h1>
          <p className="text-sm text-gray-500">{total} total cars</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <Link href="/admin/cars/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Add New Car
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : cars.length > 0 ? (
        <>
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                    <th className="px-4 py-3">Car</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Fuel</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={car.images?.[0] || "/placeholder-car.svg"}
                              alt={car.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold line-clamp-1">{car.title}</p>
                            <p className="text-xs text-gray-500">{car.brand} {car.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                        {formatPrice(car.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{car.city}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{car.fuelType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{car.year}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/cars/${car._id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(car._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            label="cars"
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <Car className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-600">
            {search ? "No cars match your search" : "No cars yet"}
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            {search ? "Try a different search term" : "Start by adding your first car listing"}
          </p>
          {!search && (
            <Link href="/admin/cars/new" className="btn-primary text-sm">
              Add New Car
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

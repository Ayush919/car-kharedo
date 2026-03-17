"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/CarCard";
import Pagination from "@/components/Pagination";
import { ICar } from "@/types";
import { Car } from "lucide-react";

const CARS_PER_PAGE = 9;

export default function CarListGrid() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<ICar[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // Stabilize searchParams into a string to prevent infinite re-renders
  const filterString = searchParams.toString();
  const prevFilterString = useRef(filterString);

  // Reset page to 1 when filters change (not on every render)
  useEffect(() => {
    if (prevFilterString.current !== filterString) {
      prevFilterString.current = filterString;
      setPage(1);
    }
  }, [filterString]);

  // Single fetch effect — depends on stable primitives only
  useEffect(() => {
    let cancelled = false;

    async function fetchCars() {
      setLoading(true);
      const params = new URLSearchParams(filterString);
      params.set("page", page.toString());
      params.set("limit", CARS_PER_PAGE.toString());
      params.set("sort", sort);
      params.set("order", order);

      try {
        const res = await fetch(`/api/cars?${params.toString()}`);
        if (cancelled) return;
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (!data) { setCars([]); return; }
        setCars(data.cars || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch {
        if (!cancelled) setCars([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCars();
    return () => { cancelled = true; };
  }, [filterString, page, sort, order]);

  return (
    <div>
      {/* Sort Bar */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
        <span className="text-sm text-gray-500">
          <strong className="text-gray-900">{total}</strong> cars found
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split("-");
              setSort(s);
              setOrder(o);
            }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest</option>
            <option value="kilometers-asc">KM: Low to High</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
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
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-16">
          <Car className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            No cars found
          </h3>
          <p className="text-sm text-gray-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        label="cars"
        onPageChange={setPage}
      />
    </div>
  );
}

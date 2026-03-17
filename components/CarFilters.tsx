"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const cities = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
];

const brands = [
  "Honda", "Hyundai", "Maruti Suzuki", "Toyota", "Tata",
  "Mahindra", "Kia", "Volkswagen", "MG", "Skoda",
];

const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissions = ["Manual", "Automatic"];
const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
const ownershipOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"];

const budgetRanges = [
  { label: "Under 5 Lakh", min: 0, max: 500000 },
  { label: "5-10 Lakh", min: 500000, max: 1000000 },
  { label: "10-15 Lakh", min: 1000000, max: 1500000 },
  { label: "15-20 Lakh", min: 1500000, max: 2000000 },
  { label: "20-30 Lakh", min: 2000000, max: 3000000 },
  { label: "30-50 Lakh", min: 3000000, max: 5000000 },
  { label: "Above 50 Lakh", min: 5000000, max: 0 },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCity = searchParams.get("city") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeFuel = searchParams.get("fuel") || "";
  const activeTransmission = searchParams.get("transmission") || "";
  const activeYear = searchParams.get("year") || "";
  const activeOwnership = searchParams.get("ownership") || "";
  const activeBudgetMin = searchParams.get("budgetMin") || "";
  const activeBudgetMax = searchParams.get("budgetMax") || "";

  const activeFilterCount = [
    activeCity, activeBrand, activeFuel, activeTransmission,
    activeYear, activeOwnership, activeBudgetMin,
  ].filter(Boolean).length;

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setBudget = useCallback(
    (min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min) params.set("budgetMin", min.toString());
      else params.delete("budgetMin");
      if (max) params.set("budgetMax", max.toString());
      else params.delete("budgetMax");
      params.delete("page");
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("/cars");
  };

  const filterContent = (
    <div className="space-y-0">
      {/* City */}
      <FilterSection title="City">
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => updateFilter("city", activeCity === city ? "" : city)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCity === city
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget">
        <div className="space-y-2">
          {budgetRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setBudget(range.min, range.max)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                activeBudgetMin === range.min.toString()
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Make & Brand">
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => updateFilter("brand", activeBrand === brand ? "" : brand)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeBrand === brand
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type">
        <div className="flex flex-wrap gap-2">
          {fuelTypes.map((fuel) => (
            <button
              key={fuel}
              onClick={() => updateFilter("fuel", activeFuel === fuel ? "" : fuel)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFuel === fuel
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission">
        <div className="flex gap-2">
          {transmissions.map((t) => (
            <button
              key={t}
              onClick={() => updateFilter("transmission", activeTransmission === t ? "" : t)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeTransmission === t
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Year" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => updateFilter("year", activeYear === year.toString() ? "" : year.toString())}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeYear === year.toString()
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Ownership */}
      <FilterSection title="Ownership" defaultOpen={false}>
        <div className="space-y-2">
          {ownershipOptions.map((own) => (
            <button
              key={own}
              onClick={() => updateFilter("ownership", activeOwnership === own ? "" : own)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                activeOwnership === own
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {own}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="sticky top-16 z-30 border-b border-gray-200 bg-white p-3 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <div className="flex gap-3">
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-sm font-medium text-primary-500">
                    Clear All
                  </button>
                )}
                <button onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-xs font-medium text-primary-500">
                Clear All
              </button>
            )}
          </div>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            {filterContent}
          </div>
        </div>
      </aside>
    </>
  );
}

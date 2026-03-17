"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const cities = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad",
];

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-field pl-10"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="relative flex-[2]">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by car name, brand, or model..."
          className="input-field pl-10"
        />
      </div>
      <button type="submit" className="btn-primary">
        Search Cars
      </button>
    </form>
  );
}

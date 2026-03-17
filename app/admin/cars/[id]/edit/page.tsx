"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CarForm from "../../CarForm";
import { ICar } from "@/types";

export default function EditCarPage() {
  const params = useParams();
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`/api/cars/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCar(data);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!car) {
    return <div className="py-20 text-center text-gray-500">Car not found</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Car</h1>
      <CarForm car={car} isEdit />
    </div>
  );
}

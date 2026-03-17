"use client";

import { useEffect } from "react";
import { useCarStore } from "@/stores/useCarStore";

export default function RecentlyViewedTracker({ carId }: { carId: string }) {
  const addRecentlyViewed = useCarStore((s) => s.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed(carId);
  }, [carId, addRecentlyViewed]);

  return null;
}

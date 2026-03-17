"use client";

import { create } from "zustand";
import { ICar } from "@/types";
import { useEffect, useState } from "react";

// Safe localStorage helpers
function getFromStorage(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

interface CarStore {
  cars: ICar[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  wishlist: string[];
  recentlyViewed: string[];
  compareCars: string[];
  _hydrated: boolean;
  setCars: (cars: ICar[], totalPages: number, page: number) => void;
  setLoading: (loading: boolean) => void;
  toggleWishlist: (carId: string) => void;
  addRecentlyViewed: (carId: string) => void;
  toggleCompare: (carId: string) => void;
  clearCompare: () => void;
  _hydrate: () => void;
}

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
  // Initialize with empty arrays on BOTH server and client to prevent hydration mismatch
  wishlist: [],
  recentlyViewed: [],
  compareCars: [],
  _hydrated: false,

  setCars: (cars, totalPages, page) => set({ cars, totalPages, currentPage: page }),
  setLoading: (loading) => set({ loading }),

  toggleWishlist: (carId) => {
    const current = get().wishlist;
    const updated = current.includes(carId)
      ? current.filter((id) => id !== carId)
      : [...current, carId];
    saveToStorage("wishlist", updated);
    set({ wishlist: updated });
  },

  addRecentlyViewed: (carId) => {
    const current = get().recentlyViewed.filter((id) => id !== carId);
    const updated = [carId, ...current].slice(0, 10);
    saveToStorage("recentlyViewed", updated);
    set({ recentlyViewed: updated });
  },

  toggleCompare: (carId) => {
    const current = get().compareCars;
    if (current.includes(carId)) {
      set({ compareCars: current.filter((id) => id !== carId) });
    } else if (current.length < 3) {
      set({ compareCars: [...current, carId] });
    }
  },

  clearCompare: () => set({ compareCars: [] }),

  // Hydrate from localStorage AFTER mount (client-only)
  _hydrate: () => {
    if (get()._hydrated) return;
    set({
      wishlist: getFromStorage("wishlist"),
      recentlyViewed: getFromStorage("recentlyViewed"),
      _hydrated: true,
    });
  },
}));

/**
 * Hook to safely use the store after hydration.
 * Ensures server and client render the same initial HTML (empty arrays),
 * then loads localStorage values after mount.
 */
export function useHydratedCarStore() {
  const store = useCarStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useCarStore.getState()._hydrate();
    setHydrated(true);
  }, []);

  return {
    ...store,
    // Return empty arrays until hydrated to prevent flash
    wishlist: hydrated ? store.wishlist : [],
    recentlyViewed: hydrated ? store.recentlyViewed : [],
  };
}

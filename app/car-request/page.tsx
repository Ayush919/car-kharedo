/**
 * CAR REQUEST PAGE — /car-request
 *
 * Public page (no login required) where users can request a car
 * they couldn't find on the platform.
 *
 * DATA FLOW:
 *   User fills form → POST /api/car-requests → MongoDB "carrequests" collection
 *   → Admin views at /admin/requests → Updates status
 *
 * Supports pre-filling via URL params:
 *   /car-request?brand=Honda&model=Elevate&budget=1650000
 */

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  Car,
  Send,
  CheckCircle,
  ArrowLeft,
  User,
  Mail,
  Phone,
  IndianRupee,
  Calendar,
  Fuel,
  Cog,
  MapPin,
  MessageSquare,
} from "lucide-react";

const brands = [
  "Honda", "Hyundai", "Maruti Suzuki", "Toyota", "Tata",
  "Mahindra", "Kia", "Volkswagen", "MG", "Skoda",
  "BMW", "Mercedes-Benz", "Audi", "Other",
];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissions = ["Manual", "Automatic"];
const cities = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Noida", "Other",
];
const budgetRanges = [
  { label: "Under ₹5 Lakh", value: 500000 },
  { label: "₹5 - 10 Lakh", value: 1000000 },
  { label: "₹10 - 15 Lakh", value: 1500000 },
  { label: "₹15 - 20 Lakh", value: 2000000 },
  { label: "₹20 - 30 Lakh", value: 3000000 },
  { label: "₹30 - 50 Lakh", value: 5000000 },
  { label: "Above ₹50 Lakh", value: 7500000 },
];

function CarRequestForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    brand: "",
    model: "",
    budget: 0,
    fuelType: "",
    transmission: "",
    preferredYear: 0,
    city: "",
    message: "",
  });

  // Pre-fill from URL params (e.g., from "Request This Car" button)
  useEffect(() => {
    const brand = searchParams.get("brand") || "";
    const model = searchParams.get("model") || "";
    const budget = searchParams.get("budget") || "";
    const city = searchParams.get("city") || "";
    const car = searchParams.get("car") || "";

    setForm((prev) => ({
      ...prev,
      brand: brand || prev.brand,
      model: model || prev.model,
      budget: budget ? parseInt(budget) : prev.budget,
      city: city || prev.city,
      message: car ? `I'm interested in: ${car}` : prev.message,
    }));
  }, [searchParams]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/car-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit request. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Request Submitted!
          </h1>
          <p className="mb-8 text-gray-500">
            Your car request has been submitted successfully. Our team will
            review your requirements and contact you within 24 hours.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/cars" className="btn-primary">
              Browse Available Cars
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "", email: "", phone: "", brand: "", model: "",
                  budget: 0, fuelType: "", transmission: "", preferredYear: 0,
                  city: "", message: "",
                });
              }}
              className="btn-secondary"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cars"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Request a Car
          </h1>
          <p className="mt-2 text-gray-500">
            Can&apos;t find the car you&apos;re looking for? Tell us your
            requirements and we&apos;ll source it for you.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5 text-primary-500" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="input-field pl-10"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="input-field pl-10"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Car Preferences */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Car className="h-5 w-5 text-primary-500" />
                Car Preferences
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <select
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => updateField("model", e.target.value)}
                    className="input-field"
                    placeholder="e.g., Creta, City, Swift"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      Budget Range
                    </span>
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => updateField("budget", parseInt(e.target.value))}
                    className="input-field"
                  >
                    <option value={0}>Select Budget</option>
                    {budgetRanges.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5" />
                      Fuel Type
                    </span>
                  </label>
                  <select
                    value={form.fuelType}
                    onChange={(e) => updateField("fuelType", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Fuel Type</option>
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <Cog className="h-3.5 w-3.5" />
                      Transmission
                    </span>
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) => updateField("transmission", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Transmission</option>
                    {transmissions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Preferred Year
                    </span>
                  </label>
                  <select
                    value={form.preferredYear}
                    onChange={(e) => updateField("preferredYear", parseInt(e.target.value))}
                    className="input-field"
                  >
                    <option value={0}>Any Year</option>
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Preferred City
                    </span>
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 text-primary-500" />
                Additional Requirements
              </h2>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="input-field"
                placeholder="Tell us any specific requirements — color preference, features needed, condition expectations, etc."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? "Submitting..." : "Submit Request"}
              </button>
              <Link href="/cars" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams requires it
export default function CarRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      }
    >
      <CarRequestForm />
    </Suspense>
  );
}

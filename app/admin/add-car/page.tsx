/**
 * ADMIN ADD CAR PAGE
 * Route: /admin/add-car
 *
 * DATA FLOW:
 * 1. Admin fills the form with car details (title, brand, model, year, price, etc.)
 * 2. On submit → POST request sent to /api/cars/create
 * 3. API connects to MongoDB and creates a new document in "cars" collection
 * 4. On success → Admin is redirected to /admin/cars (car list page)
 * 5. The /cars page fetches from /api/cars → new car appears automatically
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Car, ImagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const cities = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Noida",
];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissions = ["Manual", "Automatic"];
const ownershipOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"];

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state for all car fields
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: 2023,
    price: 0,
    city: "",
    fuelType: "Petrol",
    transmission: "Manual",
    kilometers: 0,
    ownership: "1st Owner",
    registrationState: "",
    description: "",
  });

  // Features: comma-separated input that gets converted to array on submit
  const [featuresInput, setFeaturesInput] = useState("");
  // Images: array of URL strings
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Add another image URL input field
  const addImageField = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  // Update image URL at specific index
  const updateImageUrl = (idx: number, value: string) => {
    const updated = [...imageUrls];
    updated[idx] = value;
    setImageUrls(updated);
  };

  // Remove image URL field
  const removeImageField = (idx: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  /**
   * FORM SUBMIT HANDLER
   * Flow: Form → POST /api/cars/create → MongoDB → Redirect to car list
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert comma-separated features string into array
    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    // Filter out empty image URLs
    const images = imageUrls.filter((url) => url.trim().length > 0);

    // Build request body matching the Car schema
    const body = {
      ...form,
      features,
      images,
    };

    try {
      // POST to our create car API endpoint
      const res = await fetch("/api/cars/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(true);
        // Redirect to admin cars list after short delay so user sees success message
        setTimeout(() => {
          router.push("/admin/cars");
          router.refresh();
        }, 1000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add car. Please check all fields.");
      }
    } catch {
      setError("Something went wrong. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/cars"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Car</h1>
          <p className="text-sm text-gray-500">
            Fill in the details below. The car will appear on /cars after saving.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Car added successfully! Redirecting to car list...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Information ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title - full width */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="input-field"
                placeholder="e.g., Honda City 2023 VX CVT"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                className="input-field"
                placeholder="e.g., Honda"
              />
            </div>

            {/* Model */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
                className="input-field"
                placeholder="e.g., City"
              />
            </div>

            {/* Year */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={form.year}
                onChange={(e) => updateField("year", parseInt(e.target.value))}
                className="input-field"
                min={2000}
                max={2026}
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => updateField("price", parseInt(e.target.value))}
                className="input-field"
                min={0}
                placeholder="e.g., 839000"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <select
                required
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

            {/* Fuel Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.fuelType}
                onChange={(e) => updateField("fuelType", e.target.value)}
                className="input-field"
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Transmission <span className="text-red-500">*</span>
              </label>
              <select
                value={form.transmission}
                onChange={(e) => updateField("transmission", e.target.value)}
                className="input-field"
              >
                {transmissions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Kilometers */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Kilometers Driven <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={form.kilometers}
                onChange={(e) => updateField("kilometers", parseInt(e.target.value))}
                className="input-field"
                min={0}
                placeholder="e.g., 23000"
              />
            </div>

            {/* Ownership */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ownership <span className="text-red-500">*</span>
              </label>
              <select
                value={form.ownership}
                onChange={(e) => updateField("ownership", e.target.value)}
                className="input-field"
              >
                {ownershipOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Registration State */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Registration State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.registrationState}
                onChange={(e) => updateField("registrationState", e.target.value)}
                className="input-field"
                placeholder="e.g., DL, MH, UP"
              />
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Description</h2>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="input-field"
            placeholder="Describe the car condition, features, reason for selling, etc."
          />
        </div>

        {/* ── Features (comma separated) ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold">Features</h2>
          <p className="mb-3 text-sm text-gray-500">
            Enter features separated by commas (e.g., Sunroof, Rear Camera, Cruise Control)
          </p>
          <input
            type="text"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            className="input-field"
            placeholder="Sunroof, Rear Camera, Cruise Control, LED Headlights"
          />
          {/* Preview parsed features */}
          {featuresInput.trim() && (
            <div className="mt-3 flex flex-wrap gap-2">
              {featuresInput.split(",").map((f, idx) =>
                f.trim() ? (
                  <span
                    key={idx}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {f.trim()}
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>

        {/* ── Images (array of URLs) ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold">Images</h2>
            </div>
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              <Plus className="h-4 w-4" /> Add Image URL
            </button>
          </div>
          <p className="mb-3 text-sm text-gray-500">
            Paste image URLs. You can use any image hosting service.
          </p>
          <div className="space-y-2">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`https://picsum.photos/400/${300 + idx}`}
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Submit Buttons ── */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading || success} className="btn-primary">
            {loading ? "Saving..." : success ? "Saved!" : "Add Car"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>

        {/* Flow explanation for developers */}
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-400">
          <p className="font-semibold text-gray-500">Data Flow:</p>
          <p>Admin Form → POST /api/cars/create → MongoDB (cars collection) → /api/cars fetches data → /cars page displays cars</p>
        </div>
      </form>
    </div>
  );
}

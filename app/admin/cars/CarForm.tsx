"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { ICar } from "@/types";
import ImageUpload from "@/components/ImageUpload";

interface CarFormProps {
  car?: ICar;
  isEdit?: boolean;
}

const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissions = ["Manual", "Automatic"];
const ownershipOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"];

export default function CarForm({ car, isEdit }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(car?.images || []);
  const [features, setFeatures] = useState<string[]>(car?.features || [""]);
  const [form, setForm] = useState({
    title: car?.title || "",
    brand: car?.brand || "",
    model: car?.model || "",
    year: car?.year || 2023,
    price: car?.price || 0,
    city: car?.city || "",
    fuelType: car?.fuelType || "Petrol",
    transmission: car?.transmission || "Manual",
    kilometers: car?.kilometers || 0,
    ownership: car?.ownership || "1st Owner",
    registrationState: car?.registrationState || "",
    description: car?.description || "",
    inspectionReport: car?.inspectionReport || "",
    serviceHistory: car?.serviceHistory || "",
  });

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFeature = () => setFeatures((prev) => [...prev, ""]);
  const updateFeature = (idx: number, value: string) => {
    const updated = [...features];
    updated[idx] = value;
    setFeatures(updated);
  };
  const removeFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...form,
      images,
      features: features.filter((f) => f.trim()),
    };

    try {
      const url = isEdit ? `/api/cars/${car?._id}` : "/api/cars";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/cars");
        router.refresh();
      } else {
        alert("Failed to save car");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="input-field"
              placeholder="e.g., Honda City 2023 VX CVT"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Brand</label>
            <input
              type="text"
              required
              value={form.brand}
              onChange={(e) => updateField("brand", e.target.value)}
              className="input-field"
              placeholder="e.g., Honda"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Model</label>
            <input
              type="text"
              required
              value={form.model}
              onChange={(e) => updateField("model", e.target.value)}
              className="input-field"
              placeholder="e.g., City"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Year</label>
            <input
              type="number"
              required
              value={form.year}
              onChange={(e) => updateField("year", parseInt(e.target.value))}
              className="input-field"
              min={2000}
              max={2025}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => updateField("price", parseInt(e.target.value))}
              className="input-field"
              min={0}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <select
              required
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="input-field"
            >
              <option value="">Select City</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Fuel Type</label>
            <select
              value={form.fuelType}
              onChange={(e) => updateField("fuelType", e.target.value)}
              className="input-field"
            >
              {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Transmission</label>
            <select
              value={form.transmission}
              onChange={(e) => updateField("transmission", e.target.value)}
              className="input-field"
            >
              {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Kilometers Driven</label>
            <input
              type="number"
              required
              value={form.kilometers}
              onChange={(e) => updateField("kilometers", parseInt(e.target.value))}
              className="input-field"
              min={0}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ownership</label>
            <select
              value={form.ownership}
              onChange={(e) => updateField("ownership", e.target.value)}
              className="input-field"
            >
              {ownershipOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Registration State</label>
            <input
              type="text"
              required
              value={form.registrationState}
              onChange={(e) => updateField("registrationState", e.target.value)}
              className="input-field"
              placeholder="e.g., Delhi"
            />
          </div>
        </div>
      </div>

      {/* Images - Uploaded to Uploadcare CDN */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Images</h2>
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={10}
        />
      </div>

      {/* Description & Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Details</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="input-field"
              placeholder="Describe the car..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Inspection Report</label>
            <textarea
              rows={3}
              value={form.inspectionReport}
              onChange={(e) => updateField("inspectionReport", e.target.value)}
              className="input-field"
              placeholder="Engine: Excellent | Transmission: Good | ..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Service History</label>
            <textarea
              rows={3}
              value={form.serviceHistory}
              onChange={(e) => updateField("serviceHistory", e.target.value)}
              className="input-field"
              placeholder="Service history details..."
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Features</h2>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1 text-sm font-medium text-primary-500"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={feat}
                onChange={(e) => updateFeature(idx, e.target.value)}
                className="input-field flex-1"
                placeholder="e.g., Sunroof"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEdit ? "Update Car" : "Add Car"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

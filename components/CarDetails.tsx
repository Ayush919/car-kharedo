"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  Shield,
  Award,
  Wrench,
  Star,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  GitCompare,
  Car,
  Cog,
} from "lucide-react";
import { ICar } from "@/types";
import { formatPrice, formatKilometers } from "@/lib/utils";
import { useHydratedCarStore } from "@/stores/useCarStore";
import CarGallery from "./CarGallery";

interface CarDetailsProps {
  car: ICar;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const router = useRouter();
  const { wishlist, toggleWishlist, toggleCompare, compareCars } = useHydratedCarStore();
  const [showTestDrive, setShowTestDrive] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState("");
  const [testDrivePhone, setTestDrivePhone] = useState("");
  const [submitted, setSubmitted] = useState("");

  const isWishlisted = wishlist.includes(car._id);
  const isComparing = compareCars.includes(car._id);

  const handleTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted("testdrive");
    setShowTestDrive(false);
  };

  const handleRequestCar = () => {
    const params = new URLSearchParams({
      brand: car.brand || "",
      model: car.model || "",
      budget: car.price.toString(),
      city: car.city || "",
      car: car.title || "",
    });
    router.push(`/car-request?${params.toString()}`);
  };

  return (
    <div className="container-custom py-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <CarGallery images={car.images} title={car.title} />

          {/* Overview */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Car Overview</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                { icon: Calendar, label: "Year", value: car.year },
                { icon: Fuel, label: "Fuel Type", value: car.fuelType },
                { icon: Gauge, label: "Kilometers", value: formatKilometers(car.kilometers) },
                { icon: Cog, label: "Transmission", value: car.transmission },
                { icon: MapPin, label: "City", value: car.city },
                { icon: Shield, label: "Ownership", value: car.ownership },
                { icon: Car, label: "Brand", value: car.brand },
                { icon: ClipboardCheck, label: "Registration", value: car.registrationState },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          {car.description && (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-primary-500" />
                Great Things About This Car
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">{car.description}</p>
            </section>
          )}

          {/* Inspection Report */}
          {car.inspectionReport && (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-xl font-bold flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-green-500" />
                Car Inspection Report
              </h2>
              <div className="space-y-2">
                {car.inspectionReport.split("|").map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm text-gray-700">{item.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features */}
          {car.features.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-xl font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-500" />
                Features & Specifications
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {car.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-500" />
                    <span className="text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Service History */}
          {car.serviceHistory && (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 text-xl font-bold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                Service History Report
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">{car.serviceHistory}</p>
            </section>
          )}

          {/* Why Choose Us */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Why Choose Our Platform</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: Shield, title: "200+ Point Inspection", desc: "Every car undergoes rigorous quality checks" },
                { icon: Award, title: "Certified Quality", desc: "All cars certified by expert mechanics" },
                { icon: Wrench, title: "Free Service History", desc: "Complete service records available" },
                { icon: Star, title: "1 Year Warranty", desc: "Comprehensive warranty on engine & transmission" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 rounded-lg bg-primary-50 p-4">
                  <item.icon className="h-8 w-8 shrink-0 text-primary-500" />
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Sticky Price & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Price Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h1 className="mb-1 text-xl font-bold text-gray-900">{car.title}</h1>
              <p className="mb-4 text-sm text-gray-500">
                {car.year} &bull; {car.fuelType} &bull; {formatKilometers(car.kilometers)}
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(car.price)}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-semibold">Price Breakdown</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Car Price</span>
                  <span>{formatPrice(car.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transfer Charges</span>
                  <span>{formatPrice(Math.round(car.price * 0.02))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Fee</span>
                  <span>{formatPrice(9999)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatPrice(car.price + Math.round(car.price * 0.02) + 9999)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowTestDrive(true)}
                  className="btn-primary w-full"
                >
                  Book Test Drive
                </button>
                <button
                  onClick={handleRequestCar}
                  className="btn-secondary w-full"
                >
                  Request This Car
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWishlist(car._id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                      isWishlisted
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </button>
                  <button
                    onClick={() => toggleCompare(car._id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                      isComparing
                        ? "border-primary-200 bg-primary-50 text-primary-600"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <GitCompare className="h-4 w-4" />
                    Compare
                  </button>
                </div>
              </div>
            </div>

            {submitted === "testdrive" && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                Test drive booked successfully! We&apos;ll contact you shortly.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {showTestDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Book a Test Drive</h2>
            <p className="mb-4 text-sm text-gray-500">{car.title} - {car.city}</p>
            <form onSubmit={handleTestDrive} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={testDriveDate}
                  onChange={(e) => setTestDriveDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={testDrivePhone}
                  onChange={(e) => setTestDrivePhone(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowTestDrive(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

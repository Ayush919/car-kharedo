"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  User,
  MapPin,
  IndianRupee,
  Mail,
  Phone,
  Car,
  Calendar,
  Fuel,
  Cog,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { ICarRequest } from "@/types";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  sourcing: "bg-blue-100 text-blue-700",
  found: "bg-green-100 text-green-700",
  delivered: "bg-purple-100 text-purple-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ICarRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/car-requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/car-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
    } catch {
      alert("Failed to update status");
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      await fetch(`/api/car-requests/${id}`, { method: "DELETE" });
      setRequests(requests.filter((r) => r._id !== id));
    } catch {}
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Car Requests</h1>
          <p className="text-sm text-gray-500">
            {requests.length} total request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              {/* Header: Name + Status */}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    {req.name || (req.userId as any)?.name || "Unknown"}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {req.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {req.email}
                      </span>
                    )}
                    {req.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {req.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={req.status}
                    onChange={(e) => updateStatus(req._id, e.target.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusColors[req.status] || "bg-gray-100"}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="sourcing">Sourcing</option>
                    <option value="found">Found</option>
                    <option value="delivered">Delivered</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => deleteRequest(req._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete request"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Car Preferences Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {req.brand && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <Car className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">Brand</p>
                      <p className="text-xs font-semibold">{req.brand} {req.model}</p>
                    </div>
                  </div>
                )}
                {/* Legacy field */}
                {!req.brand && req.requestedCar && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:col-span-2">
                    <Car className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">Requested Car</p>
                      <p className="text-xs font-semibold">{req.requestedCar}</p>
                    </div>
                  </div>
                )}
                {(req.budget > 0) && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">Budget</p>
                      <p className="text-xs font-semibold">{formatPrice(req.budget)}</p>
                    </div>
                  </div>
                )}
                {req.fuelType && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <Fuel className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">Fuel</p>
                      <p className="text-xs font-semibold">{req.fuelType}</p>
                    </div>
                  </div>
                )}
                {req.transmission && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <Cog className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">Transmission</p>
                      <p className="text-xs font-semibold">{req.transmission}</p>
                    </div>
                  </div>
                )}
                {req.preferredYear > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">Year</p>
                      <p className="text-xs font-semibold">{req.preferredYear}</p>
                    </div>
                  </div>
                )}
                {req.city && (
                  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-[10px] uppercase text-gray-400">City</p>
                      <p className="text-xs font-semibold">{req.city}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              {req.message && (
                <div className="mt-3 flex gap-2 rounded-lg bg-blue-50 px-3 py-2">
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                  <p className="text-xs text-blue-700">{req.message}</p>
                </div>
              )}

              {/* Timestamp */}
              <p className="mt-3 text-[10px] text-gray-400">
                Submitted: {new Date(req.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-600">No car requests yet</h3>
          <p className="text-sm text-gray-400">
            Requests from users will appear here
          </p>
        </div>
      )}
    </div>
  );
}

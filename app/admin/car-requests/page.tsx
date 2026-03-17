"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ClipboardList,
  Search,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Car,
  IndianRupee,
  Fuel,
  Cog,
  Calendar,
  MessageSquare,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Filter,
  Users,
} from "lucide-react";
import { ICarRequest } from "@/types";
import { formatPrice } from "@/lib/utils";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-700" },
  sourcing: { label: "Contacted", bg: "bg-blue-100", text: "text-blue-700" },
  found: { label: "Approved", bg: "bg-green-100", text: "text-green-700" },
  delivered: { label: "Delivered", bg: "bg-purple-100", text: "text-purple-700" },
  closed: { label: "Rejected", bg: "bg-red-100", text: "text-red-700" },
};

interface Stats {
  total: number;
  pending: number;
  contacted: number;
  approved: number;
  delivered: number;
}

export default function AdminCarRequestsPage() {
  const [requests, setRequests] = useState<ICarRequest[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, contacted: 0, approved: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ICarRequest | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/car-requests?${params.toString()}`);
      const data = await res.json();
      setRequests(Array.isArray(data.requests) ? data.requests : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.stats) setStats(data.stats);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => fetchRequests(), search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchRequests]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

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
    if (!confirm("Are you sure you want to delete this request? This action cannot be undone.")) return;
    try {
      await fetch(`/api/car-requests/${id}`, { method: "DELETE" });
      setRequests((prev) => prev.filter((r) => r._id !== id));
      if (selectedRequest?._id === id) setSelectedRequest(null);
      fetchRequests();
    } catch {
      alert("Failed to delete request");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Car Requests</h1>
        <p className="text-sm text-gray-500">
          Manage all car requests submitted by users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total", value: stats.total, icon: ClipboardList, color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Contacted", value: stats.contacted, icon: Phone, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Delivered", value: stats.delivered, icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-gray-200 ${stat.bg} p-4`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            </div>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sourcing">Contacted</option>
            <option value="found">Approved</option>
            <option value="delivered">Delivered</option>
            <option value="closed">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Request ID
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Brand / Model
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Budget
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => {
                const cfg = statusConfig[req.status] || statusConfig.pending;
                return (
                  <tr
                    key={req._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {/* Request ID */}
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-400">
                      #{req._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Name + Email */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {req.name || (req.userId as any)?.name || "—"}
                      </p>
                      <p className="text-xs text-gray-400">{req.email}</p>
                    </td>

                    {/* Phone */}
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {req.phone || "—"}
                    </td>

                    {/* Brand / Model */}
                    <td className="px-4 py-3">
                      {req.brand ? (
                        <span className="font-medium text-gray-800">
                          {req.brand} {req.model}
                        </span>
                      ) : req.requestedCar ? (
                        <span className="text-gray-600">{req.requestedCar}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Budget */}
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-800">
                      {req.budget > 0 ? formatPrice(req.budget) : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                      >
                        {cfg.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Mark Contacted */}
                        {req.status === "pending" && (
                          <button
                            onClick={() => updateStatus(req._id, "sourcing")}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Mark as contacted"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                        )}

                        {/* Approve */}
                        {(req.status === "pending" || req.status === "sourcing") && (
                          <button
                            onClick={() => updateStatus(req._id, "found")}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-green-400 transition-colors hover:bg-green-50 hover:text-green-600"
                            title="Approve request"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}

                        {/* Reject */}
                        {req.status !== "closed" && req.status !== "delivered" && (
                          <button
                            onClick={() => updateStatus(req._id, "closed")}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Reject request"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => deleteRequest(req._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <ClipboardList className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-600">No car requests found</h3>
          <p className="text-sm text-gray-400">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Requests from users will appear here"}
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          label="requests"
          onPageChange={setPage}
        />
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            {/* Close */}
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <p className="mb-1 font-mono text-xs text-gray-400">
                #{selectedRequest._id.slice(-6).toUpperCase()}
              </p>
              <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
            </div>

            {/* Contact Info */}
            <div className="mb-5 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-xs text-gray-400">Name</span>
                  <span className="font-medium text-gray-900">
                    {selectedRequest.name || (selectedRequest.userId as any)?.name || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-xs text-gray-400">Email</span>
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="flex items-center gap-1 font-medium text-primary-600 hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    {selectedRequest.email}
                  </a>
                </div>
                {selectedRequest.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-xs text-gray-400">Phone</span>
                    <a
                      href={`tel:${selectedRequest.phone}`}
                      className="flex items-center gap-1 font-medium text-primary-600 hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {selectedRequest.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Car Preferences */}
            <div className="mb-5 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Car className="h-4 w-4" />
                Car Preferences
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedRequest.brand && (
                  <div>
                    <p className="text-[10px] uppercase text-gray-400">Brand / Model</p>
                    <p className="text-sm font-semibold">{selectedRequest.brand} {selectedRequest.model}</p>
                  </div>
                )}
                {!selectedRequest.brand && selectedRequest.requestedCar && (
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase text-gray-400">Requested Car</p>
                    <p className="text-sm font-semibold">{selectedRequest.requestedCar}</p>
                  </div>
                )}
                {selectedRequest.budget > 0 && (
                  <div>
                    <p className="flex items-center gap-1 text-[10px] uppercase text-gray-400">
                      <IndianRupee className="h-3 w-3" /> Budget
                    </p>
                    <p className="text-sm font-semibold">{formatPrice(selectedRequest.budget)}</p>
                  </div>
                )}
                {selectedRequest.fuelType && (
                  <div>
                    <p className="flex items-center gap-1 text-[10px] uppercase text-gray-400">
                      <Fuel className="h-3 w-3" /> Fuel Type
                    </p>
                    <p className="text-sm font-semibold">{selectedRequest.fuelType}</p>
                  </div>
                )}
                {selectedRequest.transmission && (
                  <div>
                    <p className="flex items-center gap-1 text-[10px] uppercase text-gray-400">
                      <Cog className="h-3 w-3" /> Transmission
                    </p>
                    <p className="text-sm font-semibold">{selectedRequest.transmission}</p>
                  </div>
                )}
                {selectedRequest.preferredYear > 0 && (
                  <div>
                    <p className="flex items-center gap-1 text-[10px] uppercase text-gray-400">
                      <Calendar className="h-3 w-3" /> Preferred Year
                    </p>
                    <p className="text-sm font-semibold">{selectedRequest.preferredYear}</p>
                  </div>
                )}
                {selectedRequest.city && (
                  <div>
                    <p className="flex items-center gap-1 text-[10px] uppercase text-gray-400">
                      <MapPin className="h-3 w-3" /> City
                    </p>
                    <p className="text-sm font-semibold">{selectedRequest.city}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            {selectedRequest.message && (
              <div className="mb-5 rounded-xl bg-blue-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </h3>
                <p className="text-sm text-blue-800">{selectedRequest.message}</p>
              </div>
            )}

            {/* Timestamp */}
            <p className="mb-5 text-xs text-gray-400">
              Submitted: {new Date(selectedRequest.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              {selectedRequest.status === "pending" && (
                <button
                  onClick={() => {
                    updateStatus(selectedRequest._id, "sourcing");
                    setSelectedRequest(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Mark Contacted
                </button>
              )}
              {(selectedRequest.status === "pending" || selectedRequest.status === "sourcing") && (
                <button
                  onClick={() => {
                    updateStatus(selectedRequest._id, "found");
                    setSelectedRequest(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Approve
                </button>
              )}
              {selectedRequest.status !== "closed" && selectedRequest.status !== "delivered" && (
                <button
                  onClick={() => {
                    updateStatus(selectedRequest._id, "closed");
                    setSelectedRequest(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              )}
              <button
                onClick={() => {
                  deleteRequest(selectedRequest._id);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

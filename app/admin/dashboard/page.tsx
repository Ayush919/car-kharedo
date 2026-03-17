"use client";

import { useEffect, useState } from "react";
import { Car, Users, ClipboardList, TrendingUp, IndianRupee, MapPin } from "lucide-react";

interface Stats {
  totalCars: number;
  totalUsers: number;
  totalRequests: number;
  pendingRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCars: 0,
    totalUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [carsRes, usersRes, reqRes] = await Promise.all([
          fetch("/api/cars?limit=1"),
          fetch("/api/users"),
          fetch("/api/car-requests"),
        ]);
        const carsData = await carsRes.json();
        const usersData = await usersRes.json();
        const reqData = await reqRes.json();

        setStats({
          totalCars: carsData.total || 0,
          totalUsers: Array.isArray(usersData) ? usersData.length : 0,
          totalRequests: Array.isArray(reqData) ? reqData.length : 0,
          pendingRequests: Array.isArray(reqData)
            ? reqData.filter((r: any) => r.status === "pending").length
            : 0,
        });
      } catch {}
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Cars", value: stats.totalCars, icon: Car, color: "bg-blue-500" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-green-500" },
    { label: "Car Requests", value: stats.totalRequests, icon: ClipboardList, color: "bg-purple-500" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/admin/cars/new" className="btn-primary text-center text-sm">
              Add New Car
            </a>
            <a href="/admin/requests" className="btn-secondary text-center text-sm">
              View Requests
            </a>
            <a href="/admin/users" className="btn-secondary text-center text-sm">
              Manage Users
            </a>
            <a href="/api/seed" className="btn-secondary text-center text-sm"
              onClick={async (e) => {
                e.preventDefault();
                if (confirm("This will reset all data. Continue?")) {
                  await fetch("/api/seed", { method: "POST" });
                  window.location.reload();
                }
              }}
            >
              Seed Database
            </a>
          </div>
        </div>

        {/* Platform Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Platform Info</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">Platform</span>
              <span className="text-sm font-semibold">carKharedo</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">Cities Covered</span>
              <span className="text-sm font-semibold">8+ Cities</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">Image Storage</span>
              <span className="text-sm font-semibold">Local (public/uploads)</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-semibold">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

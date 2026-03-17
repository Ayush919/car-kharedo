"use client";

import { useEffect, useState } from "react";
import {
  Database,
  User,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface DebugUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  createdAt: string;
}

interface DebugResponse {
  count?: number;
  users?: DebugUser[];
  dbUri?: string;
  error?: string;
  hint?: string;
}

export default function DebugPage() {
  const [data, setData] = useState<DebugResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/debug/users");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setData({ error: err.message, hint: "Is the dev server running?" });
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    setSeedResult("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      setSeedResult(
        res.ok
          ? `Seeded! ${json.carsCount} cars + admin user created.`
          : `Error: ${json.error || "Seed failed"}`,
      );
      // Refresh user list
      await fetchUsers();
    } catch (err: any) {
      setSeedResult(`Failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container-custom py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="h-6 w-6 text-primary-500" />
              Debug Panel
            </h1>
            <p className="text-sm text-gray-500">
              Check database connection and user data
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Connection Status */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-base font-semibold">MongoDB Connection</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking connection...
            </div>
          ) : data?.error ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Connection Failed</p>
                  <p>{data.error}</p>
                  {data.hint && (
                    <p className="mt-1 text-red-600">{data.hint}</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                <p className="font-semibold">How to fix:</p>
                <ol className="mt-1 list-inside list-decimal space-y-1">
                  <li>Install MongoDB if not installed</li>
                  <li>
                    Start MongoDB: run{" "}
                    <code className="rounded bg-yellow-100 px-1.5 py-0.5">
                      mongod
                    </code>{" "}
                    in a terminal
                  </li>
                  <li>
                    Or use MongoDB Atlas and update{" "}
                    <code className="rounded bg-yellow-100 px-1.5 py-0.5">
                      MONGODB_URI
                    </code>{" "}
                    in .env.local
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Connected to {data?.dbUri || "MongoDB"}
            </div>
          )}
        </div>

        {/* Seed Database */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-base font-semibold">Seed Database</h2>
          <p className="mb-3 text-sm text-gray-500">
            Creates admin user (admin@carplatform.com / admin123) and sample
            cars.
          </p>
          <button
            onClick={seedDatabase}
            disabled={seeding || !!data?.error}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            {seeding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {seeding ? "Seeding..." : "Seed Database Now"}
          </button>
          {seedResult && (
            <p
              className={`mt-3 rounded-lg p-3 text-sm ${
                seedResult.startsWith("Seeded")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {seedResult}
            </p>
          )}
        </div>

        {/* Users List */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-base font-semibold">
            Users in Database ({data?.count ?? 0})
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading users...
            </div>
          ) : data?.users && data.users.length > 0 ? (
            <div className="space-y-3">
              {data.users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="mt-1 text-xs text-gray-400">
                      {user.city || "No city"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.error ? (
            <div className="rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-700">
              <p className="font-semibold">No users found!</p>
              <p className="mt-1">
                Click &quot;Seed Database Now&quot; above to create the admin
                user.
              </p>
            </div>
          ) : null}
        </div>

        {/* Login Test */}
        {data?.users && data.users.length > 0 && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            <p className="font-semibold">Database is ready!</p>
            <p className="mt-1">
              Go to{" "}
              <a href="/login" className="font-medium underline">
                /login
              </a>{" "}
              and sign in with:
            </p>
            <p className="mt-1 font-mono text-xs">
              Email: admin@carplatform.com
              <br />
              Password: admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

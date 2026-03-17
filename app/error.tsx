"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Something went wrong
      </h1>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        An unexpected error occurred. This could be due to a network issue or a
        temporary server problem.
      </p>

      {/* Show error details in development */}
      {process.env.NODE_ENV === "development" && error?.message && (
        <div className="mb-6 max-w-lg rounded-xl border border-red-200 bg-red-50 p-4 text-left">
          <p className="text-xs font-semibold text-red-700">Error Details:</p>
          <p className="mt-1 text-xs text-red-600">{error.message}</p>
          {error.digest && (
            <p className="mt-1 text-xs text-red-400">Digest: {error.digest}</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}

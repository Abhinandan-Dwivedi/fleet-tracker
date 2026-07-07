"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-6">
        We hit an unexpected error loading this page.
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
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
    <div className="page flex min-h-[60vh] items-center justify-center">
      <div className="card w-full max-w-md animate-fade-in p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-6 w-6" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4.5M12 16h.01" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-1.5 text-sm text-muted">
          We hit an unexpected error loading this page.
        </p>
        <button onClick={reset} className="btn btn-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}

"use client";

import { trpc } from "@/lib/trpc";
import { LocationSimulator } from "@/components/LocationSimulator";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const FleetMap = dynamic(
  () => import("@/components/FleetMap").then((mod) => mod.FleetMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-2xl bg-slate-100 border border-slate-200/80 animate-pulse flex flex-col items-center justify-center gap-2 text-slate-400">
        <svg
          className="animate-spin h-6 w-6 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-xs font-medium">Initializing Map Engine...</span>
      </div>
    ),
  }
);

export default function MapPage() {
  const { data: session } = useSession();
  const driversQuery = trpc.driver.list.useQuery();

  if (!session || driversQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
          <div className="h-[500px] w-full rounded-2xl bg-slate-100 border border-slate-200/80 animate-pulse flex items-center justify-center text-slate-400 text-xs font-medium">
            Loading Live Map Data...
          </div>
        </div>
      </div>
    );
  }

  const driverNames = Object.fromEntries(
    (driversQuery.data ?? []).map((d) => [d.id, d.name])
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Live Fleet Map
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time telemetry and GPS location tracking for active personnel.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Tracking
          </span>
        </div>

        {/* Location Simulator Control Container */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 sm:p-5">
          <LocationSimulator drivers={driversQuery.data ?? []} />
        </div>

        {/* Map Container Viewport */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-2">
          <FleetMap
            companyId={session.user.companyId}
            driverNames={driverNames}
          />
        </div>
      </div>
    </div>
  );
}
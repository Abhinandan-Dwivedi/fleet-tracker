"use client";

import { trpc } from "@/lib/trpc";
import { LocationSimulator } from "@/components/LocationSimulator";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { LivePill, PageHeader, Spinner } from "@/components/ui";

const MAP_HEIGHT = "h-[clamp(380px,65vh,640px)]";

const FleetMap = dynamic(
  () => import("@/components/FleetMap").then((mod) => mod.FleetMap),
  {
    ssr: false,
    loading: () => (
      <div
        className={`${MAP_HEIGHT} flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-surface-muted text-muted`}
      >
        <Spinner className="h-6 w-6 text-subtle" />
        <span className="text-sm font-medium">Initializing map…</span>
      </div>
    ),
  }
);

export default function MapPage() {
  const { data: session } = useSession();
  const driversQuery = trpc.driver.list.useQuery();

  if (!session || driversQuery.isLoading) {
    return (
      <div className="page space-y-8" aria-busy="true">
        <div className="space-y-3">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-8 w-56" />
          <div className="skeleton h-4 w-80 max-w-full" />
        </div>
        <div className="skeleton h-[92px] w-full rounded-xl" />
        <div
          className={`card ${MAP_HEIGHT} flex w-full items-center justify-center text-sm font-medium text-muted`}
        >
          <span className="flex items-center gap-2">
            <Spinner className="text-subtle" />
            Loading live map data…
          </span>
        </div>
      </div>
    );
  }

  const driverNames = Object.fromEntries(
    (driversQuery.data ?? []).map((d) => [d.id, d.name])
  );

  return (
    <div className="page animate-fade-in space-y-6">
      <PageHeader
        eyebrow="Telemetry"
        title="Live fleet map"
        description="Real-time telemetry and GPS location tracking for active personnel."
        action={<LivePill label="Live tracking" />}
      />

      <LocationSimulator drivers={driversQuery.data ?? []} />

      {/* isolate: keeps Leaflet's high z-index panes below the app's nav drawer */}
      <div className={`card isolate overflow-hidden p-1.5 ${MAP_HEIGHT} box-content`}>
        <div className="h-full overflow-hidden rounded-lg">
          <FleetMap
            companyId={session.user.companyId}
            driverNames={driverNames}
          />
        </div>
      </div>
    </div>
  );
}

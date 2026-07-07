"use client";

import { trpc } from "@/lib/trpc";
import { LocationSimulator } from "@/components/LocationSimulator";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const FleetMap = dynamic(
  () => import("@/components/FleetMap").then((mod) => mod.FleetMap),
  { ssr: false, loading: () => <p>Loading map...</p> }
);

export default function MapPage() {
  const { data: session } = useSession();
  const driversQuery = trpc.driver.list.useQuery();

  if (!session || driversQuery.isLoading) {
    return <div className="p-8">Loading map...</div>;
  }

  const driverNames = Object.fromEntries(
    (driversQuery.data ?? []).map((d) => [d.id, d.name])
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Live Fleet Map</h1>

      <LocationSimulator drivers={driversQuery.data ?? []} />

      <FleetMap
        companyId={session.user.companyId}
        driverNames={driverNames}
      />
    </div>
  );
}
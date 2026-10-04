"use client";

import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

interface LocationSimulatorProps {
  drivers: { id: string; name: string }[];
}

export function LocationSimulator({ drivers }: LocationSimulatorProps) {
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateLocation = trpc.driver.updateLocation.useMutation();

  const baseLatitude = 25.3176;
  const baseLongitude = 82.9739;

  const startSimulation = () => {
    if (!selectedDriverId) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {

      const latitude = baseLatitude + (Math.random() - 0.5) * 0.02;
      const longitude = baseLongitude + (Math.random() - 0.5) * 0.02;

      updateLocation.mutate({
        driverId: selectedDriverId,
        latitude,
        longitude,
      });
    }, 3000);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  return (
    <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
            <path d="M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9.5V3" />
            <path d="M7.5 15h9" />
          </svg>
        </span>
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            GPS simulator
            <span className="rounded border border-line bg-surface-muted px-1.5 py-px font-mono text-[10px] font-medium uppercase tracking-wider text-muted">
              Dev tool
            </span>
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {isRunning ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Broadcasting a location every 3 seconds
              </span>
            ) : (
              "Move a driver around the map to test live updates."
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 sm:w-auto">
        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
          disabled={isRunning}
          aria-label="Driver to simulate"
          className="input select min-w-0 flex-1 sm:w-56"
        >
          <option value="">Select a driver...</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>

        {!isRunning ? (
          <button
            onClick={startSimulation}
            disabled={!selectedDriverId}
            className="btn btn-success"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
            </svg>
            Start Moving
          </button>
        ) : (
          <button
            onClick={stopSimulation}
            className="btn btn-danger"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
            Stop
          </button>
        )}
      </div>
    </section>
  );
}

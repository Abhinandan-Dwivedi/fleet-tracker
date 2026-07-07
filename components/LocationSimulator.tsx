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
    <div className="border rounded p-4 mb-4 bg-yellow-50">
      <p className="text-sm font-medium mb-2">
        🧪 Dev Tool: GPS Simulator
      </p>
      <div className="flex gap-2 items-center">
        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
          disabled={isRunning}
          className="border rounded px-2 py-1 text-sm"
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
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Start Moving
          </button>
        ) : (
          <button
            onClick={stopSimulation}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
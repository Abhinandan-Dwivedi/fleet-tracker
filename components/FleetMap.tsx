"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { pusherClient } from "@/lib/pusher-client";
import "leaflet/dist/leaflet.css";

interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
}

interface FleetMapProps {
  companyId: string;
  driverNames: Record<string, string>;  
}

 
const driverIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function FleetMap({ companyId, driverNames }: FleetMapProps) {
  const [locations, setLocations] = useState<Record<string, DriverLocation>>({});

  useEffect(() => {
    const channel = pusherClient.subscribe(`company-${companyId}`);

    channel.bind("location-update", (data: DriverLocation) => {
      setLocations((prev) => ({
        ...prev,
        [data.driverId]: data,
      }));
    });

    return () => {
      pusherClient.unsubscribe(`company-${companyId}`);
    };
  }, [companyId]);

  const defaultCenter: [number, number] = [25.3176, 82.9739]; // Varanasi

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {Object.values(locations).map((loc) => (
        <Marker
          key={loc.driverId}
          position={[loc.latitude, loc.longitude]}
          icon={driverIcon}
        >
          <Popup>{driverNames[loc.driverId] ?? "Unknown driver"}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 
"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapController } from "./MapController";
import { RouteInfo } from "./RouteInfo";
import { TripMarkers } from "./TripMarkers";
import { RoutingPolyline } from "../RoutingPolyline";

// Fix for default markers in Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface TripMapClientProps {
  stops: Array<{
    id: string;
    title: string;
    lat: number;
    lng: number;
    type: "start" | "stop" | "end";
    order: number;
    description?: string;
  }>;
  className?: string;
}

/**
 * Interactive trip map with real-time routing and state management
 * Features:
 * - Progressive enhancement with fallback routing
 * - Color-coded markers (green=start, blue=stops, red=end, gold=selected)
 * - Real road routing via OSRM API
 * - Jotai state management for reactive updates
 * - Mobile-friendly responsive design
 */
export default function TripMapClient({
  stops = [],
  className = "h-64",
}: TripMapClientProps) {
  // Generate unique key for map re-rendering when stops change
  const tripKey = stops.map((s) => s.id).join("-");

  // Handle empty stops
  if (stops.length === 0) {
    return (
      <div
        className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}
      >
        <p className="text-gray-500">No stops to display</p>
      </div>
    );
  }

  // Sort stops by order
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  // Calculate center point from all stops
  const centerLat =
    sortedStops.reduce((sum, stop) => sum + stop.lat, 0) / sortedStops.length;
  const centerLng =
    sortedStops.reduce((sum, stop) => sum + stop.lng, 0) / sortedStops.length;
  const center: [number, number] = [centerLat, centerLng];

  return (
    <div className={`${className} rounded-lg overflow-hidden relative`}>
      {/* Route info overlay */}
      <RouteInfo />

      <MapContainer
        center={center}
        key={tripKey}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map controller for handling zoom and fit bounds */}
        <MapController stops={sortedStops} />

        {/* Routing polyline - progressive enhancement */}
        <RoutingPolyline
          key={tripKey}
          stops={sortedStops}
          color="#3b82f6"
          weight={4}
        />

        {/* Trip markers */}
        <TripMarkers stops={sortedStops} />
      </MapContainer>
    </div>
  );
}

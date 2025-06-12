"use client";
import dynamic from "next/dynamic";

// Dynamically import the map with no SSR
const DynamicMap = dynamic(() => import("./map/TripMapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface TripMapProps {
  stops: Array<{
    id: string;
    title: string;
    lat: number;
    lng: number;
    type: "start" | "stop" | "end";
    order: number;
  }>;
  className?: string;
}

export function TripMap(props: TripMapProps) {
  return <DynamicMap {...props} />;
}

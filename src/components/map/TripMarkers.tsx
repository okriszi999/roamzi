"use client";
import { Marker, Popup } from "react-leaflet";
import { useAtom } from "jotai";
import { selectedStopIdAtom } from "@/lib/atoms/map.atoms";
import { MapIcons } from "./MapIcons";

interface TripMarkersProps {
  stops: Array<{
    id: string;
    title: string;
    lat: number;
    lng: number;
    type: "start" | "stop" | "end";
    order: number;
    description?: string;
  }>;
}

/**
 * Renders all markers for trip stops with proper icons and popups
 */
export function TripMarkers({ stops }: TripMarkersProps) {
  const [selectedStopId] = useAtom(selectedStopIdAtom);

  // Sort stops by order
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  return (
    <>
      {sortedStops.map((stop, index) => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={MapIcons.getIcon(stop, selectedStopId ?? undefined)}
        >
          <Popup>
            <div className="text-center">
              <strong className="capitalize">
                {stop.type} #{index + 1}
              </strong>
              <br />
              <span className="font-semibold">{stop.title}</span>
              <br />
              <span className="text-sm text-gray-600">
                {stop.description || "No description"}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

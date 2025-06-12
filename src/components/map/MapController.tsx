"use client";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { selectedStopIdAtom } from "@/lib/atoms/map.atoms";

interface MapControllerProps {
  stops: Array<{
    id: string;
    lat: number;
    lng: number;
  }>;
}

/**
 * Map controller component to handle zoom actions and bounds fitting
 * Uses Jotai for reactive state management
 */
export function MapController({ stops }: MapControllerProps) {
  const map = useMap();
  const [selectedStopId] = useAtom(selectedStopIdAtom);

  // 🔥 Fit bounds to show all stops on initial load
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((stop) => [stop.lat, stop.lng]));
      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 10,
      });
    }
  }, [stops, map]);

  // Handle selected stop zoom with smooth animation
  useEffect(() => {
    if (selectedStopId) {
      const stop = stops.find((s) => s.id === selectedStopId);
      if (stop) {
        map.flyTo([stop.lat, stop.lng], 12, {
          duration: 1.5,
          easeLinearity: 0.1,
        });
      }
    }
  }, [selectedStopId, stops, map]);

  return null;
}

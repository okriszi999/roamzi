"use client";
import { useEffect, useState, useCallback } from "react";
import { Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useAtom } from "jotai";
import { routeInfoAtom } from "@/lib/atoms/route.atoms";
import { useRouteData } from "@/hooks/useRouteData";

interface RoutingPolylineProps {
  stops: Array<{
    lat: number;
    lng: number;
  }>;
  color?: string;
  weight?: number;
}

export function RoutingPolyline({
  stops,
  color = "#3b82f6",
  weight = 4,
}: RoutingPolylineProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<LatLngExpression[]>(
    []
  );
  const [, setRouteInfo] = useAtom(routeInfoAtom);

  // 🔥 Use the cached route data
  const { data: routeData, isLoading, error, isFetching } = useRouteData(stops);

  // Fallback calculation for straight-line distance
  const calculateStraightDistance = useCallback(
    (stops: Array<{ lat: number; lng: number }>) => {
      let totalDistance = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        const lat1 = (stops[i].lat * Math.PI) / 180;
        const lon1 = (stops[i].lng * Math.PI) / 180;
        const lat2 = (stops[i + 1].lat * Math.PI) / 180;
        const lon2 = (stops[i + 1].lng * Math.PI) / 180;

        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;

        const a =
          Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dlon / 2) *
            Math.sin(dlon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = 6371 * c;

        totalDistance += distance;
      }
      return totalDistance;
    },
    []
  );

  // 🔥 Create a stable key for the stops to prevent infinite loops
  const stopsKey = stops
    .map((s) => `${s.lat.toFixed(4)},${s.lng.toFixed(4)}`)
    .join("|");

  useEffect(() => {
    if (stops.length < 2) {
      setRouteInfo({
        distance: 0,
        duration: 0,
        isLoading: false,
      });
      setRouteCoordinates([]);
      return;
    }

    // Always show straight line first for immediate visual feedback
    const fallbackCoords = stops.map(
      (stop) => [stop.lat, stop.lng] as LatLngExpression
    );
    setRouteCoordinates(fallbackCoords);

    if (isLoading || isFetching) {
      // 🔥 Show loading state
      setRouteInfo({
        distance: 0,
        duration: 0,
        isLoading: true,
      });
      console.log("🔄 Fetching route data...");
    } else if (routeData) {
      // 🔥 Use cached/fresh route data
      const leafletCoords = routeData.geometry.map(
        (coord: number[]) => [coord[1], coord[0]] as LatLngExpression
      );
      setRouteCoordinates(leafletCoords);

      setRouteInfo({
        distance: routeData.distance,
        duration: routeData.duration,
        isLoading: false,
      });

      console.log("✅ Route data loaded:", {
        distance: `${routeData.distance.toFixed(1)}km`,
        duration: `${routeData.duration.toFixed(1)}h`,
        cached: !isFetching,
      });
    } else if (error) {
      // 🔥 Fallback to straight-line calculation
      console.warn("⚠️ Route API failed, using fallback:", error);

      const fallbackDistance = calculateStraightDistance(stops);
      const estimatedDuration = fallbackDistance / 90;

      setRouteInfo({
        distance: fallbackDistance,
        duration: estimatedDuration,
        isLoading: false,
      });
    }
  }, [
    stopsKey, // 🔥 Use stable stopsKey instead of stops
    routeData,
    isLoading,
    error,
    isFetching,
    calculateStraightDistance,
    // 🔥 REMOVE setRouteInfo from dependencies!
  ]);

  return routeCoordinates.length > 0 ? (
    <Polyline positions={routeCoordinates} color={color} weight={weight} />
  ) : null;
}

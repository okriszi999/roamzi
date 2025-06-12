import { useQuery } from "@tanstack/react-query";

interface Stop {
  lat: number;
  lng: number;
}

interface RouteData {
  distance: number; // in km
  duration: number; // in hours
  geometry: number[][];
}

// 🔥 Function to fetch route from OSRM
async function fetchRoute(stops: Stop[]): Promise<RouteData> {
  if (stops.length < 2) {
    throw new Error("Need at least 2 stops");
  }

  const coordinates = stops.map((stop) => `${stop.lng},${stop.lat}`).join(";");

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
    { method: "GET" }
  );

  if (!response.ok) {
    throw new Error(`OSRM API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.routes?.[0]?.geometry?.coordinates) {
    throw new Error("No route found");
  }

  const route = data.routes[0];
  const distance = route.distance / 1000; // convert to km
  const duration = route.duration / 3600; // convert to hours

  // Validate data
  if (distance <= 0 || distance > 50000 || duration <= 0 || duration > 2400) {
    throw new Error("Invalid route data");
  }

  return {
    distance,
    duration,
    geometry: route.geometry.coordinates,
  };
}

// 🔥 Custom hook with caching
export function useRouteData(stops: Stop[]) {
  // Create a stable cache key
  const cacheKey = stops
    .map((s) => `${s.lat.toFixed(4)},${s.lng.toFixed(4)}`)
    .join("|");

  return useQuery({
    queryKey: ["route", cacheKey], // 🔥 Cache key
    queryFn: () => fetchRoute(stops),
    enabled: stops.length >= 2, // Only run if we have enough stops
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    retry: (failureCount, error) => {
      // Don't retry if it's a validation error
      if (error.message.includes("Invalid route data")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

"use client";
import { useAtom } from "jotai";
import { formattedRouteInfoAtom } from "@/lib/atoms/route.atoms";

/**
 * Route info overlay component
 * Shows distance and duration with loading state
 */
export function RouteInfo() {
  const [routeInfo] = useAtom(formattedRouteInfoAtom);

  if (routeInfo.isLoading) {
    return (
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 z-[1000] shadow-lg">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="animate-spin w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full"></div>
          <span>Calculating route...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 z-[1000] shadow-lg">
      <div className="text-xs font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <span>📍 {routeInfo.distance}</span>
          <span>⏱️ {routeInfo.duration}</span>
        </div>
      </div>
    </div>
  );
}

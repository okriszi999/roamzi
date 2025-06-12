import { atom } from "jotai";

// 🔥 Route information state
export interface RouteInfo {
  distance: number; // in km
  duration: number; // in hours
  isLoading: boolean;
}

export const routeInfoAtom = atom<RouteInfo>({
  distance: 0,
  duration: 0,
  isLoading: true,
});

// 🔥 Derived atom for formatted display
export const formattedRouteInfoAtom = atom((get) => {
  const info = get(routeInfoAtom);
  return {
    distance: `${info.distance.toFixed(1)} km`,
    duration: `${info.duration.toFixed(1)}h`,
    isLoading: info.isLoading,
  };
});

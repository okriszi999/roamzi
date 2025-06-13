// src/hooks/useGeolocation.ts
import { useState, useCallback } from "react";

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: false,
    error: null,
  });

  const getCurrentLocation = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Geolocation not supported",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          location: { lat: latitude, lng: longitude },
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Location access failed";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return {
    ...state,
    getCurrentLocation,
  };
}

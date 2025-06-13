"use client";
import { useState } from "react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { LocationResult } from "@/types/location";

type LocationSearchProps = {
  onLocationSelect: (location: LocationResult) => void;
  value?: string;
  onChange?: (value: string) => void;
};

export function LocationSearch({
  onLocationSelect,
  value = "",
  onChange,
}: LocationSearchProps) {
  const [showResults, setShowResults] = useState(false);
  const { data: results = [], isLoading } = useLocationSearch(value);

  const handleLocationClick = (location: LocationResult) => {
    setShowResults(false);
    onChange?.(location.displayName);
    onLocationSelect(location);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search locations..."
          value={value}
          onChange={(e) => {
            setShowResults(true);
            onChange?.(e.target.value);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10"
        />
        {isLoading && value.length >= 3 && (
          <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-blue-500" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
          {results.map((location, i) => (
            <Card
              key={`${location.lat}-${location.lng}-${i}`}
              className="p-3 m-1 cursor-pointer hover:bg-blue-50 border-0"
              onClick={() => handleLocationClick(location)}
            >
              <p className="font-medium text-sm">{location.displayName}</p>
              <p className="text-xs text-gray-400">
                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { Button } from "../ui/button";
import { Loader2, MapPin } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CurrentLocationButton({ form }: { form: any }) {
  const { location, isLoading, getCurrentLocation } = useGeolocation();

  const handleCurrentLocation = async () => {
    try {
      await getCurrentLocation();

      if (location) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json&addressdetails=1`
        );
        const data = await response.json();

        const address = data.address || {};

        // 🔥 Build proper display value like in LocationSearch
        const buildInputValue = () => {
          const parts = [];

          // House number + street
          if (address.house_number && address.road) {
            parts.push(`${address.house_number} ${address.road}`);
          } else if (address.road) {
            parts.push(address.road);
          }

          // City
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality;
          if (city) parts.push(city);

          return parts.join(", ");
        };

        const inputValue = buildInputValue();
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality;
        const country = address.country;
        const countryCode = address.country_code?.toUpperCase();

        if (inputValue) {
          // 🔥 Update with proper formatted value
          form.setValue("location", inputValue, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
          });

          // Update other fields
          form.setValue("lat", location.lat);
          form.setValue("lng", location.lng);
          if (city) form.setValue("city", city);
          if (country) form.setValue("country", country);
          if (countryCode) form.setValue("countryCode", countryCode);

          console.log("✅ Form updated with current location:", inputValue);
        }
      }
    } catch (error) {
      console.error("❌ Current location failed:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCurrentLocation}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Getting Location...
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4 mr-2" />
          📍 Use Current Location
        </>
      )}
    </Button>
  );
}

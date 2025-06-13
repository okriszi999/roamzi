import { useQuery } from "@tanstack/react-query";
import { LocationResult } from "@/types/location";
import { useDebounce } from "./useDebounce";

export function useLocationSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["location-search", debouncedQuery],
    queryFn: async (): Promise<LocationResult[]> => {
      if (!debouncedQuery || debouncedQuery.length < 3) return [];

      // 🔥 Multiple search strategies for better house number coverage
      const searchStrategies = [
        // Strategy 1: Exact search with house numbers
        {
          q: debouncedQuery,
          format: "json",
          addressdetails: "1",
          limit: "10",
          extratags: "1",
          namedetails: "1",
          dedupe: "1",
          zoom: "18", // 🔥 Max zoom for house-level precision
        },
        // Strategy 2: If query has numbers, try structured search
        ...(debouncedQuery.match(/\d+/)
          ? [
              {
                street: debouncedQuery.replace(/\d+/g, "").trim(),
                housenumber: debouncedQuery.match(/\d+/)?.[0] || "",
                format: "json",
                addressdetails: "1",
                limit: "5",
                extratags: "1",
              },
            ]
          : []),
        // Strategy 3: Broader search without house number
        {
          q: debouncedQuery.replace(/\d+/g, "").trim(),
          format: "json",
          addressdetails: "1",
          limit: "8",
          extratags: "1",
          namedetails: "1",
          dedupe: "1",
        },
      ];

      console.log(`� Searching for: "${debouncedQuery}"`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allResults: any[] = [];

      // 🔥 Try each search strategy
      for (const [index, params] of searchStrategies.entries()) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const searchParams = new URLSearchParams(params as any);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${searchParams}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log(
              `✅ Strategy ${index + 1} found ${data.length} results`
            );
            allResults = [...allResults, ...data];
          }
        } catch (error) {
          console.warn(`⚠️ Strategy ${index + 1} failed:`, error);
        }
      }

      console.log(`📍 Total results found: ${allResults.length}`);

      return (
        allResults
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => {
            const address = item.address || {};

            const buildDisplayName = () => {
              const parts = [];

              // 🔥 House number + street (most important for addresses)
              if (address.house_number && address.road) {
                parts.push(`${address.house_number} ${address.road}`);
              } else if (address.road) {
                parts.push(address.road);
              } else if (item.name) {
                parts.push(item.name);
              }

              // Area/neighborhood
              if (address.neighbourhood || address.suburb) {
                parts.push(address.neighbourhood || address.suburb);
              }

              // City/town/village
              const city =
                address.city ||
                address.town ||
                address.village ||
                address.municipality;
              if (city) parts.push(city);

              // County for Hungarian addresses
              if (address.county || address.state) {
                parts.push(address.county || address.state);
              }

              // Country
              if (address.country) parts.push(address.country);

              return parts.join(", ");
            };

            // 🔥 Calculate relevance score for house numbers
            const hasExactHouseNumber =
              debouncedQuery.match(/\d+/) &&
              address.house_number === debouncedQuery.match(/\d+/)?.[0];

            const relevanceBoost = hasExactHouseNumber ? 1 : 0;

            return {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              displayName: buildDisplayName() || item.display_name,
              name: item.name || address.road || "",
              city:
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                "",
              country: address.country || "",
              countryCode: address.country_code?.toUpperCase() || "",
              streetNumber: address.house_number || "",
              streetName: address.road || "",
              neighbourhood: address.neighbourhood || address.suburb || "",
              postcode: address.postcode || "",
              placeType: item.type || item.class || "unknown",
              importance: (item.importance || 0) + relevanceBoost,
              // 🔥 Add precision indicator
              precision: address.house_number
                ? "house"
                : address.road
                ? "street"
                : ("area" as "house" | "street" | "area"),
            };
          })
          // 🔥 Remove duplicates
          .filter(
            (location, index, self) =>
              index ===
              self.findIndex(
                (l) =>
                  Math.abs(l.lat - location.lat) < 0.0001 &&
                  Math.abs(l.lng - location.lng) < 0.0001
              )
          )
          // 🔥 Sort by relevance (house numbers first, then importance)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => {
            // Prioritize exact house matches
            if (a.streetNumber && !b.streetNumber) return -1;
            if (!a.streetNumber && b.streetNumber) return 1;
            // Then by importance
            return (b.importance || 0) - (a.importance || 0);
          })
      );
    },
    enabled: debouncedQuery.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}

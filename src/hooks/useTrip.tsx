import { Trip } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export function useTrip() {
  return useQuery<Trip[]>({
    queryKey: ["trip"],
    queryFn: async () => {
      const result = await fetch("api/v1/trip");

      if (!result.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await result.json();
      return data;
    },
  });
}

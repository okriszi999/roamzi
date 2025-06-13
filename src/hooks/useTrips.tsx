import { TripWithParticipants } from "@/server/db/schema/trip.schema";
import { useQuery } from "@tanstack/react-query";

export function useTrips() {
  return useQuery<TripWithParticipants[]>({
    queryKey: ["trips"],
    queryFn: async () => {
      const result = await fetch("/api/v1/trip");

      if (!result.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await result.json();
      return data;
    },
  });
}

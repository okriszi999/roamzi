import { TripWithParticipantsAndStops } from "@/server/db/schema/trip.schema";
import { useQuery } from "@tanstack/react-query";

export function useTrip({ slug }: { slug?: string } = {}) {
  return useQuery<TripWithParticipantsAndStops>({
    queryKey: [`trip-${slug}`],
    queryFn: async () => {
      const result = await fetch("/api/v1/trip/" + slug);

      if (!result.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await result.json();
      return data;
    },
  });
}

"use client";
import { Trip } from "@/db/schema";
import { useTrip } from "@/hooks/useTrip";

export default function Home() {
  const { data, isLoading, error } = useTrip();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
  return (
    <div className="">
      {data?.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{trip.title}</h3>
      <p className="text-gray-600">{trip.description}</p>
      <div className="text-sm text-gray-500">
        {trip.startDate} - {trip.endDate}
      </div>
    </div>
  );
}

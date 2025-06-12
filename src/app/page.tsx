"use client";
import { TripWithParticipants } from "@/server/db/schema/trip.schema";
import { useTrips } from "@/hooks/useTrips";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: trips, isLoading, error } = useTrips();

  const { data, status } = useSession();

  const user = data?.user;

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
      {JSON.stringify(user)}
      {status}

      {trips?.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}

export function TripCard({ trip }: { trip: TripWithParticipants }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{trip.title}</h3>
      <p className="text-gray-600">{trip.description}</p>
      <div className="text-sm text-gray-500">
        {trip.startDate} - {trip.endDate}
        <br></br>
        {trip.participants.map((participant) => (
          <div key={participant.id}>
            {participant.user.name} ({participant.user.email})
          </div>
        ))}
      </div>
    </div>
  );
}

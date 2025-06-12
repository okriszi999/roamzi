import { db } from "@/db";
import { trips } from "@/db/schema";

export async function GET() {
  try {
    const allTrips = await db.select().from(trips);
    // Convert dates to strings for serialization
    const serializedTrips = allTrips.map((trip) => ({
      ...trip,
      createdAt: trip.createdAt?.toString(),
      updatedAt: trip.updatedAt?.toString(),
    }));

    return Response.json(serializedTrips);
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}

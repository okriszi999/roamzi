import { db } from "@/server/db";

export async function GET() {
  try {
    const allTrips = await db.query.trips.findMany({
      with: {
        participants: {
          with: {
            user: true,
          },
        },
      },
    });

    console.log(allTrips);
    return Response.json(allTrips, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}

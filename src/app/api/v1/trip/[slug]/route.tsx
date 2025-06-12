import { db } from "@/server/db";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { slug: string };
  }
) {
  // Extract the slug from the route params

  const slug = params.slug;
  try {
    const trip = await db.query.trips.findFirst({
      with: {
        participants: {
          with: {
            user: true,
          },
        },
        stops: true,
      },
      where: (trips, { eq }) => eq(trips.id, slug),
    });

    console.log(trip);
    return Response.json(trip, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}

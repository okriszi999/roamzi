"use server";

import { revalidatePath } from "next/cache";
import { CreateTripInput, createTripSchema } from "./schema";
import { createUniqueSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { participants, trips, users } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { eq } from "drizzle-orm";

export async function createTrip(data: CreateTripInput) {
  let finalSlug: string;

  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to create a trip.",
      };
    }

    // 🔥 Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    const parsedData = createTripSchema.parse(data);
    finalSlug = createUniqueSlug(parsedData.title);

    // 🔥 Do database work in transaction
    await db.transaction(async (tx) => {
      const [trip] = await tx
        .insert(trips)
        .values({
          title: parsedData.title,
          slug: finalSlug,
          description: parsedData.description,
          ownerId: user.id,
          startDate: parsedData.startDate,
          endDate: parsedData.endDate,
        })
        .returning();

      console.log("✅ Trip created:", trip.slug);

      const [participant] = await tx
        .insert(participants)
        .values({
          tripId: trip.id,
          userId: user.id,
          role: "owner",
        })
        .returning();

      console.log("✅ Participant added:", participant.id);

      // ✅ NO redirect here - just return the trip
      return trip;
    });

    // 🔥 Revalidate paths after successful transaction
    revalidatePath("/trips");
    revalidatePath(`/trips/${finalSlug}`);

    return {
      success: true,
      tripSlug: finalSlug,
    };
  } catch (error) {
    console.error("❌ Error creating trip:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create trip",
    };
  }
}

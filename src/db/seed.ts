import { db } from ".";
import { Trip, trips } from "./schema";
import { createId } from "@paralleldrive/cuid2";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    await db.insert(trips).values(defaultTrips);
  } catch (error) {
    console.error("Error seeding database:", error);
    return;
  }

  console.log("✅ Database seeded successfully!");
}

const defaultTrips = [
  {
    id: createId(), // Add this!
    title: "Trip to Montenegro, Tivat",
    description:
      "A beautiful trip to the coastal city of Tivat in Montenegro, known for its stunning beaches and vibrant nightlife.",
    startDate: new Date("2025-06-11").toISOString(),
    endDate: new Date("2025-06-18").toISOString(),
    createdAt: new Date().toISOString(), // Add this!
    updatedAt: new Date().toISOString(), // Add this!
    stops: '["1", "2"]', // Ensure this is a stringified array
  },
  {
    id: createId(),
    title: "Trip to Croatia, Dubrovnik",
    description:
      "Exploring the historic city of Dubrovnik in Croatia, famous for its medieval architecture and stunning Adriatic coastline.",
    startDate: new Date("2025-07-01").toISOString(),
    endDate: new Date("2025-07-08").toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stops: '["1", "2"]', // Ensure this is a stringified array
  },
  {
    id: createId(),
    title: "Trip to Greece, Athens",
    description:
      "A cultural journey through Athens, Greece, visiting ancient ruins and enjoying the vibrant local cuisine.",
    startDate: new Date("2025-08-01").toISOString(),
    endDate: new Date("2025-08-08").toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stops: '["1", "2"]', // Ensure this is a stringified array
  },
] as Trip[];

await seed();

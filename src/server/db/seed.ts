import { db } from ".";
import { users as usersTable, trips, participants } from "./schema";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";

async function seedUsers() {
  try {
    const userData = [
      {
        id: "user_okriszi", // Fixed ID for you
        email: "o.kriszi99@gmail.com", // Your real email
        name: "Kriszi (Owner)",
        emailVerified: null,
        image: null,
        password: await bcrypt.hash("123456Ab!", 12), // Your password
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "user_admin",
        email: "admin@example.com",
        name: "Admin User",
        emailVerified: null,
        image: null,
        password: await bcrypt.hash("password123", 12),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "user_companion1",
        email: "companion1@example.com",
        name: "Travel Buddy 1",
        emailVerified: null,
        image: null,
        password: await bcrypt.hash("password123", 12),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "user_companion2",
        email: "companion2@example.com",
        name: "Travel Buddy 2",
        emailVerified: null,
        image: null,
        password: await bcrypt.hash("password123", 12),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    await db.insert(usersTable).values(userData);
    console.log("✅ Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

async function seedTrips() {
  try {
    const tripData = [
      {
        id: "trip_montenegro",
        title: "Epic Montenegro Road Trip",
        description:
          "Coastal drive through Montenegro with the squad - beaches, mountains, and good vibes!",
        ownerId: "user_okriszi", // You're the owner
        startDate: new Date("2025-06-11").toISOString(),
        endDate: new Date("2025-06-18").toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "trip_croatia",
        title: "Croatian Coast Adventure",
        description:
          "Exploring Dubrovnik and the stunning Adriatic coastline with the crew.",
        ownerId: "user_okriszi", // You're the owner of this one too
        startDate: new Date("2025-07-01").toISOString(),
        endDate: new Date("2025-07-08").toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "trip_greece",
        title: "Greek Island Hopping",
        description:
          "Island hopping through the Greek islands - Santorini, Mykonos, and more!",
        ownerId: "user_okriszi", // You own this one too
        startDate: new Date("2025-08-01").toISOString(),
        endDate: new Date("2025-08-10").toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await db.insert(trips).values(tripData);
    console.log("✅ Trips seeded successfully!");
  } catch (error) {
    console.error("Error seeding trips:", error);
  }
}

async function seedTripParticipants() {
  try {
    const participantData = [
      // Montenegro trip participants
      {
        id: createId(),
        tripId: "trip_montenegro",
        userId: "user_okriszi",
        role: "owner" as const,
        joinedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        userId: "user_admin",
        role: "admin" as const,
        joinedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        userId: "user_companion1",
        role: "companion" as const,
        joinedAt: new Date().toISOString(),
      },

      // Croatia trip participants
      {
        id: createId(),
        tripId: "trip_croatia",
        userId: "user_okriszi",
        role: "owner" as const,
        joinedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        userId: "user_companion1",
        role: "admin" as const,
        joinedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        userId: "user_companion2",
        role: "companion" as const,
        joinedAt: new Date().toISOString(),
      },

      // Greece trip participants (smaller group)
      {
        id: createId(),
        tripId: "trip_greece",
        userId: "user_okriszi",
        role: "owner" as const,
        joinedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        userId: "user_companion2",
        role: "companion" as const,
        joinedAt: new Date().toISOString(),
      },
    ];

    await db.insert(participants).values(participantData);
    console.log("✅ Trip participants seeded successfully!");
  } catch (error) {
    console.error("Error seeding trip participants:", error);
  }
}

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data first
  try {
    await db.delete(participants);
    await db.delete(trips);
    await db.delete(usersTable);
    console.log("🧹 Cleared existing data");
  } catch (error) {
    console.log("No existing data to clear");
  }

  await seedUsers();
  await seedTrips();
  await seedTripParticipants();

  console.log("🎉 All data seeded successfully!");
  console.log("📧 Your login: o.kriszi99@gmail.com");
  console.log("🔐 Your password: 123456Ab!");
}

await seed();

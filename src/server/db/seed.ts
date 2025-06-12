import { db } from ".";
import { users as usersTable, trips, participants, stops } from "./schema";
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

async function seedTripStops() {
  try {
    const stopsData = [
      // Montenegro trip stops 🇲🇪
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Budapest, Hungary",
        description: "Starting point - Departure from Budapest Airport",
        lat: 47.4979,
        lng: 19.0402,
        order: 0,
        type: "start" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Podgorica Airport",
        description: "Landing in Montenegro - Pick up rental car",
        lat: 42.3594,
        lng: 19.2519,
        order: 1,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Tivat, Montenegro",
        description: "Accommodation base - Villa Sunset with sea views",
        lat: 42.4304,
        lng: 18.6969,
        order: 2,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Kotor Old Town",
        description: "Medieval fortress city - UNESCO World Heritage site",
        lat: 42.4247,
        lng: 18.7712,
        order: 3,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Perast",
        description: "Charming coastal town - Our Lady of the Rocks",
        lat: 42.4866,
        lng: 18.7006,
        order: 4,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Budva Riviera",
        description: "Beach day and nightlife - Party central!",
        lat: 42.2864,
        lng: 18.84,
        order: 5,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Durmitor National Park",
        description: "Mountain adventure - Tara River rafting",
        lat: 43.1547,
        lng: 19.0864,
        order: 6,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_montenegro",
        title: "Budapest, Hungary",
        description: "Back home - End of epic adventure",
        lat: 47.4979,
        lng: 19.0402,
        order: 7,
        type: "end" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Croatia trip stops 🇭🇷
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Budapest, Hungary",
        description: "Starting point - Road trip begins!",
        lat: 47.4979,
        lng: 19.0402,
        order: 0,
        type: "start" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Zagreb, Croatia",
        description: "Capital city stop - Explore Upper Town",
        lat: 45.815,
        lng: 15.9819,
        order: 1,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Plitvice Lakes",
        description: "National park with stunning waterfalls",
        lat: 44.8654,
        lng: 15.582,
        order: 2,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Split, Croatia",
        description: "Diocletian's Palace and coastal vibes",
        lat: 43.5081,
        lng: 16.4402,
        order: 3,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Hvar Island",
        description: "Lavender fields and beach clubs",
        lat: 43.1729,
        lng: 16.6413,
        order: 4,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Dubrovnik",
        description: "Pearl of the Adriatic - Game of Thrones filming location",
        lat: 42.6507,
        lng: 18.0944,
        order: 5,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_croatia",
        title: "Budapest, Hungary",
        description: "Home sweet home",
        lat: 47.4979,
        lng: 19.0402,
        order: 6,
        type: "end" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // Greece trip stops 🇬🇷
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Budapest, Hungary",
        description: "Flight departure to Athens",
        lat: 47.4979,
        lng: 19.0402,
        order: 0,
        type: "start" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Athens, Greece",
        description: "Acropolis and ancient history",
        lat: 37.9838,
        lng: 23.7275,
        order: 1,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Mykonos",
        description: "Windmills and white houses - Party island!",
        lat: 37.4467,
        lng: 25.3289,
        order: 2,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Santorini",
        description: "Sunset cliffs and blue domes - Instagram paradise",
        lat: 36.3932,
        lng: 25.4615,
        order: 3,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Naxos",
        description: "Hidden gem - Less crowded, more authentic",
        lat: 37.1036,
        lng: 25.3766,
        order: 4,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Athens, Greece",
        description: "Final shopping and flight home",
        lat: 37.9838,
        lng: 23.7275,
        order: 5,
        type: "stop" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: createId(),
        tripId: "trip_greece",
        title: "Budapest, Hungary",
        description: "Back to reality",
        lat: 47.4979,
        lng: 19.0402,
        order: 6,
        type: "end" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await db.insert(stops).values(stopsData);
    console.log("✅ Trip stops seeded successfully!");
  } catch (error) {
    console.error("Error seeding trip stops:", error);
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
    throw new Error("Failed to clear existing data: " + error);
  }

  await seedUsers();
  await seedTrips();
  await seedTripParticipants();
  await seedTripStops();

  console.log("🎉 All data seeded successfully!");
  console.log("📧 Your login: o.kriszi99@gmail.com");
  console.log("🔐 Your password: 123456Ab!");
}

await seed();

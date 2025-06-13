import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./auth.schema";
import { InferResultType } from "..";

export const trips = sqliteTable("trips", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export const participants = sqliteTable("trip_participants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "admin", "companion"] }).notNull(),
  joinedAt: text("joined_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
});

export const stops = sqliteTable("trip_stops", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  order: int("order").notNull().default(0),
  type: text("type", { enum: ["start", "stop", "end"] })
    .notNull()
    .default("stop"),
});

export const location = sqliteTable("trip_locations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  stopId: text("stop_id").notNull(),
  name: text("name").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  city: text("city").notNull(),
  streetNumber: text("street_number").notNull(),
  streetName: text("street_name").notNull(),
  neighbourhood: text("neighbourhood").notNull(),
  postcode: text("postcode").notNull(),
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  precision: text("precision", {
    enum: ["house", "street", "area"],
  }).notNull(),
});

export const stopsRelations = relations(stops, ({ one }) => ({
  trip: one(trips, {
    fields: [stops.tripId],
    references: [trips.id],
  }),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  owner: one(users, {
    fields: [trips.ownerId],
    references: [users.id],
  }),
  participants: many(participants), // 🔥 Remove relationName
  stops: many(stops), // 🔥 Remove relationName
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  trip: one(trips, {
    fields: [participants.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
}));

export type Trip = typeof trips.$inferSelect;
export type TripWithParticipants = InferResultType<
  "trips",
  {
    participants: {
      with: {
        user: true;
      };
    };
  }
>;
export type TripWithParticipantsAndStops = InferResultType<
  "trips",
  {
    participants: {
      with: {
        user: true;
      };
    };
    stops: true;
  }
>;
export type NewTrip = typeof trips.$inferInsert;
export type TripParticipant = typeof participants.$inferSelect;
export type NewTripParticipant = typeof participants.$inferInsert;
export type TripStop = typeof stops.$inferSelect;
export type NewTripStop = typeof stops.$inferInsert;

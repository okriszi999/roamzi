import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./auth.schema";
import { InferResultType } from "..";

export const trips = sqliteTable("trips", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
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

// Define the relations
export const tripsRelations = relations(trips, ({ one, many }) => ({
  owner: one(users, {
    fields: [trips.ownerId],
    references: [users.id],
  }),
  participants: many(participants),
}));

export const tripParticipantsRelations = relations(participants, ({ one }) => ({
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
export type NewTrip = typeof trips.$inferInsert;
export type TripParticipant = typeof participants.$inferSelect;
export type NewTripParticipant = typeof participants.$inferInsert;

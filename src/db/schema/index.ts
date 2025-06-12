import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const trips = sqliteTable("trips", {
  // cuid
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at")
    .$default(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$default(() => new Date().toISOString())
    .notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  stops: text("stops").$default(() => "[]"),
});

export type Trip = typeof trips.$inferSelect;

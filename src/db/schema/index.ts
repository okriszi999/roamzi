import { sqliteTable } from "drizzle-orm/sqlite-core";
import { cuid2 as cuid } from "drizzle-cuid2/sqlite";

export const tripsTable = sqliteTable("trips", {
  // cuid
  id: cuid("id").defaultRandom().primaryKey(),
});

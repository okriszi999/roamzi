import { config } from "dotenv";
import { drizzle } from "drizzle-orm/bun-sqlite";

config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

const db = drizzle(process.env.DB_FILE_NAME!);

export { db };

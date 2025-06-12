import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

console.log("DB_FILE_NAME env var:", process.env.DB_FILE_NAME);

const db = drizzle(process.env.DB_FILE_NAME!, {
  schema,
});

export { db };

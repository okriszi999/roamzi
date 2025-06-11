import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.local",
});

export default defineConfig({
  out: "./src/db/drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});

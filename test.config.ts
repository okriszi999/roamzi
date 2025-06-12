import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./test-out",
  schema: "./test-schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./test.db",
  },
});

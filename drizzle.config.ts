import { defineConfig } from "drizzle-kit";

import { parseEnv } from "./src/lib/env";

// Drizzle Kit doesn't read .env on its own, but Node can.
try {
  process.loadEnvFile();
} catch {
  // No .env file: fall back to variables already set in the environment.
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: {
    url: parseEnv(process.env).DATABASE_URL,
  },
});

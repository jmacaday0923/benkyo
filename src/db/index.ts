import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";

import * as schema from "./schema";

// Keep one connection pool across hot reloads in development.
const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: postgres.Sql;
};

const client = globalForDb.postgresClient ?? postgres(env.DATABASE_URL);

if (env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });

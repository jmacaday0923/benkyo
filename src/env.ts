import { parseEnv } from "@/lib/env";

/** Validated server environment. Import this instead of reading process.env. */
export const env = parseEnv(process.env);

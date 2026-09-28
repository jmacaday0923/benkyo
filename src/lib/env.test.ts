// @vitest-environment node
import { describe, expect, it } from "vitest";

import { parseEnv } from "./env";

const DATABASE_URL = "postgres://benkyo:benkyo@localhost:5432/benkyo";

describe("parseEnv", () => {
  it("returns the typed values of a valid environment", () => {
    expect(parseEnv({ DATABASE_URL, NODE_ENV: "production" })).toEqual({
      DATABASE_URL,
      NODE_ENV: "production",
    });
  });

  it("defaults NODE_ENV to development", () => {
    expect(parseEnv({ DATABASE_URL }).NODE_ENV).toBe("development");
  });

  it("accepts the postgresql:// scheme", () => {
    const url = "postgresql://app:secret@db.example.com:5432/benkyo";

    expect(parseEnv({ DATABASE_URL: url }).DATABASE_URL).toBe(url);
  });

  it("explains how to fix a missing DATABASE_URL", () => {
    expect(() => parseEnv({})).toThrow(
      "DATABASE_URL is required. Copy .env.example to .env to get started.",
    );
  });

  it("rejects connection strings for other databases", () => {
    expect(() =>
      parseEnv({ DATABASE_URL: "mysql://root@localhost:3306/benkyo" }),
    ).toThrow("DATABASE_URL must be a postgres:// or postgresql://");
  });

  it("reports every invalid variable in one error", () => {
    expect(() =>
      parseEnv({ DATABASE_URL: "not a url", NODE_ENV: "staging" }),
    ).toThrow(/DATABASE_URL[\s\S]*NODE_ENV/);
  });
});

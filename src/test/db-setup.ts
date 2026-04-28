import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";

beforeAll(async () => {
  const url = process.env.DATABASE_URL ?? "";
  if (!url.includes("dev.db") && !url.includes("localhost")) {
    throw new Error(
      `Refusing to run integration tests against DATABASE_URL=${url}. ` +
        "Expected a local SQLite file (file:./dev.db) or localhost Postgres.",
    );
  }
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

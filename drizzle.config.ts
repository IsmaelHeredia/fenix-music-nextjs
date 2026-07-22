import type { Config } from "drizzle-kit";

export default {
  schema: "./src/modules/shared/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/fenix.db"
  }
} satisfies Config;
import { defineConfig } from "drizzle-kit";

const DATABASE_URL =
  "postgresql://postgres.ziyuwqpsqjeqtbyedldo:070885@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});

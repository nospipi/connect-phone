import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
const DATABASE_URL =
  "postgresql://postgres.ziyuwqpsqjeqtbyedldo:070885@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true";

const client = postgres(DATABASE_URL, {
  onnotice: () => {},
});
export const db = drizzle({ client, schema });

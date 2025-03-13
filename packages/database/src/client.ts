// import { config } from "dotenv";
// import { drizzle } from "drizzle-orm/postgres-js";
// import * as schema from "./schema";
// import postgres from "postgres";
// config({ path: ".env" });
// const client = postgres(process.env.DATABASE_URL!, {
//   onnotice: () => {},
// });
// export const db = drizzle({ client, schema });

// src/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Avoid using dotenv directly
let databaseUrl: string | undefined;

// In Node.js environments, get DATABASE_URL from process.env
if (typeof process !== "undefined" && process.env) {
  databaseUrl = process.env.DATABASE_URL;
}

// Validate database URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create the client
const client = postgres(databaseUrl, {
  onnotice: () => {},
});

export const db = drizzle({ client, schema });

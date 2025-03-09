// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// // For types only - not for runtime
// export type DbClient = ReturnType<typeof createDbClient>;

// /**
//  * Create a database client using Drizzle ORM with postgres-js driver
//  * @param connectionString - Postgres connection string (defaults to DATABASE_URL env var)
//  * @param options - Additional postgres.js options
//  */
// export function createDbClient(
//   connectionString = process.env.DATABASE_URL,
//   options: postgres.Options = {}
// ) {
//   if (!connectionString) {
//     throw new Error("Database connection string is required");
//   }

//   // Configure postgres.js client
//   const queryClient = postgres(connectionString, {
//     max: 10, // Connection pool size
//     idle_timeout: 20, // Max seconds a client can be idle
//     connect_timeout: 10, // Max seconds to wait for connection
//     ...options,
//   });

//   // Create and return Drizzle ORM instance with our schema
//   return drizzle(queryClient, { schema });
// }

// // For singleton usage across the monorepo (when appropriate)
// export const db = createDbClient();

// // Export query builder as well
// export { sql } from "drizzle-orm";

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
config({ path: ".env" });
const client = postgres(process.env.DATABASE_URL!, {
  onnotice: () => {},
});
export const db = drizzle({ client, schema });

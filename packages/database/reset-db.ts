import { db } from "./src/index";

async function resetDatabase() {
  console.log("Starting complete database reset...");

  try {
    // Drop all tables and types in the correct order
    console.log("Dropping existing tables and types...");

    // Use a transaction for safety
    await db.transaction(async (tx) => {
      // First, drop all tables with proper dependencies
      await tx.execute(`
        DROP TABLE IF EXISTS "usersInOrganizations" CASCADE;
        DROP TABLE IF EXISTS "users" CASCADE;
        DROP TABLE IF EXISTS "organizations" CASCADE;
        
        -- Drop any enum types
        DROP TYPE IF EXISTS role_type CASCADE;
      `);
    });

    console.log("All tables and types dropped successfully.");
    console.log("Database is now ready for fresh migrations.");

    process.exit(0);
  } catch (error) {
    console.error("Error during database reset:", error);
    console.error(error.stack);
    process.exit(1);
  }
}

resetDatabase();

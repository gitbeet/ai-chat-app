import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

// load env variables
config({ path: ".env" });

// check for db URL
if (!process.env.DATABASE_URL) {
  throw new Error("No DATABASE_URL found");
}

// init neon client
const sql = neon(process.env.DATABASE_URL);

// init drizzle with the neon client
export const db = drizzle(sql);

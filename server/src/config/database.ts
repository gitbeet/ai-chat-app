import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { config } from "dotenv";
import * as schema from "../db/schema";
import ws from "ws";
// load env variables
config({ path: ".env" });

// check for db URL
if (!process.env.DATABASE_URL) {
  throw new Error("No DATABASE_URL found");
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  ws,
  schema,
});

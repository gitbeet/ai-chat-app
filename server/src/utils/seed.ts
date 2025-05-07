import { v7 as uuid } from "uuid";
import { ChatInsert, chats } from "../db/schema";
import { db } from "../config/database";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config();

function randomDateInPastNDays(days = 1) {
  const now = Date.now();
  const msInNDays = days * 24 * 60 * 60 * 1000;
  return new Date(now - Math.floor(Math.random() * msInNDays));
}

const chatNames = [
  "How can I improve my resume?",
  "Summarize this technical article",
  "Explain how blockchain works",
  "Best practices for REST APIs",
  "Help me refactor this function",
  "Translate this to Spanish",
  "Write a follow-up email",
  "Generate a marketing headline",
  "Tips for learning TypeScript",
  "How does OAuth2 authentication work?",
  "Prepare for a coding interview",
  "Outline a product launch plan",
  "Summarize key points from this PDF",
  "Create a weekly workout routine",
  "Help draft a project proposal",
  "Compare cloud providers",
  "How to optimize SQL queries?",
];

const dayOffsets = [1, 2, 3, 5, 7, 20, 60, 120, 360, 700, 900, 1200, 1500];

const fakeChats: ChatInsert[] = chatNames.map((name, index) => ({
  id: uuid(),
  name,
  createdAt: randomDateInPastNDays(dayOffsets[index % dayOffsets.length]),
  userId: process.env.DB_USER_ID!,
}));

const seedChats = async () => {
  await db.delete(chats).where(eq(chats.userId, process.env.DB_USER_ID!));
  await db.insert(chats).values(fakeChats);
};

seedChats()
  .then(() => console.log("Chats successfully created"))
  .catch((e) => console.error("Error: ", e))
  .finally(() => console.log("Done"));

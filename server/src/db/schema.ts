import { relations } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { serial, pgTable, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profileInfo = pgTable("profileInfo", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .unique()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  message: text("message").notNull(),
  reply: text("reply").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// each user can have many chats
export const userRelations = relations(users, ({ many, one }) => ({
  chats: many(chats),
  profileInfo: one(profileInfo, {
    fields: [users.id],
    references: [profileInfo.userId],
  }),
}));

// each each and every one user has a profile info and each profile info belongs to one user (one to one)
export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, { fields: [profileInfo.userId], references: [users.id] }),
}));

// each chat can have many messages
export const chatRelations = relations(chats, ({ many, one }) => ({
  messages: many(messages),
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
}));

// a message belongs to one chat only
export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

// TODO : Move to types file
export type ChatInsert = typeof chats.$inferInsert;
export type ChatSelect = typeof chats.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
export type ProfileInfoSelect = typeof profileInfo.$inferSelect;

// // added to fix the serializeUser user parameter error
declare global {
  namespace Express {
    interface User extends ProfileInfoSelect {}
  }
}

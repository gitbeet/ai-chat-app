"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRelations = exports.chatRelations = exports.profileInfoRelations = exports.userRelations = exports.messages = exports.chats = exports.profileInfo = exports.users = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
var pg_core_2 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_2.pgTable)("users", {
    id: (0, pg_core_2.text)("id").primaryKey(),
    email: (0, pg_core_2.text)("email").notNull(),
    password: (0, pg_core_2.text)("password"),
    createdAt: (0, pg_core_2.timestamp)("created_at").defaultNow().notNull(),
});
exports.profileInfo = (0, pg_core_2.pgTable)("profileInfo", {
    id: (0, pg_core_2.serial)("id").primaryKey(),
    userId: (0, pg_core_2.text)("user_id")
        .unique()
        .references(function () { return exports.users.id; }, { onDelete: "cascade" })
        .notNull(),
    name: (0, pg_core_2.text)("name").notNull(),
    createdAt: (0, pg_core_2.timestamp)("created_at").defaultNow().notNull(),
});
exports.chats = (0, pg_core_2.pgTable)("chats", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    name: (0, pg_core_2.text)("name").notNull(),
    userId: (0, pg_core_2.text)("user_id")
        .notNull()
        .references(function () { return exports.users.id; }, { onDelete: "cascade" }),
    createdAt: (0, pg_core_2.timestamp)("created_at").defaultNow().notNull(),
});
exports.messages = (0, pg_core_2.pgTable)("messages", {
    id: (0, pg_core_2.serial)("id").primaryKey(),
    chatId: (0, pg_core_1.uuid)("chat_id")
        .references(function () { return exports.chats.id; }, { onDelete: "cascade" })
        .notNull(),
    message: (0, pg_core_2.text)("message").notNull(),
    reply: (0, pg_core_2.text)("reply").notNull(),
    createdAt: (0, pg_core_2.timestamp)("created_at").defaultNow().notNull(),
});
// each user can have many chats
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, function (_a) {
    var many = _a.many, one = _a.one;
    return ({
        chats: many(exports.chats),
        profileInfo: one(exports.profileInfo, {
            fields: [exports.users.id],
            references: [exports.profileInfo.userId],
        }),
    });
});
// each each and every one user has a profile info and each profile info belongs to one user (one to one)
exports.profileInfoRelations = (0, drizzle_orm_1.relations)(exports.profileInfo, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.users, { fields: [exports.profileInfo.userId], references: [exports.users.id] }),
    });
});
// each chat can have many messages
exports.chatRelations = (0, drizzle_orm_1.relations)(exports.chats, function (_a) {
    var many = _a.many, one = _a.one;
    return ({
        messages: many(exports.messages),
        user: one(exports.users, {
            fields: [exports.chats.userId],
            references: [exports.users.id],
        }),
    });
});
// a message belongs to one chat only
exports.messageRelations = (0, drizzle_orm_1.relations)(exports.messages, function (_a) {
    var one = _a.one;
    return ({
        chat: one(exports.chats, {
            fields: [exports.messages.chatId],
            references: [exports.chats.id],
        }),
    });
});

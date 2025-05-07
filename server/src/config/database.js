"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var neon_serverless_1 = require("drizzle-orm/neon-serverless");
var dotenv_1 = require("dotenv");
var schema = require("../db/schema");
var ws_1 = require("ws");
// load env variables
(0, dotenv_1.config)({ path: ".env" });
// check for db URL
if (!process.env.DATABASE_URL) {
    throw new Error("No DATABASE_URL found");
}
exports.db = (0, neon_serverless_1.drizzle)({
    connection: process.env.DATABASE_URL,
    ws: ws_1.default,
    schema: schema,
});

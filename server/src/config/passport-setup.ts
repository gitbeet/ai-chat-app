import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { chatClient } from "../server";
import { db } from "./database";
import { users, UserSelect } from "../db/schema";
import { eq } from "drizzle-orm";

dotenv.config();

// the user that is getting passed here is the user from the callback function (either the existingUser or the newUser)
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

// the id that is getting passed here is the id property that is getting extracted from the cookie
passport.deserializeUser(async (id: string, done) => {
  const user = await db.select().from(users).where(eq(users.userId, id));
  // TODO : Add error in case user not found?
  done(null, user[0]);
});

passport.use(
  new Strategy(
    {
      // strategy options
      clientID: process.env.GOOGLE_PLUS_API_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_PLUS_API_CLIENT_SECRET!,
      callbackURL: "/auth/google/redirect",
    },
    // callback function , executed after getting the redirect code
    async (accessToken, refreshToken, profile, done) => {
      try {
        // get the ID and the displayName from the google profile data
        const { id, displayName } = profile;
        // check if user already exists in the database
        const userResponse = await chatClient.queryUsers({
          id: { $eq: profile.id },
        });

        // if theres no such user in the stream database
        if (userResponse.users.length === 0) {
          // add new user to stream
          await chatClient.upsertUser({ id, name: displayName, role: "user" });
        }

        // check for existing user in the database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.userId, id));
        // if the user does not exist, crate one
        if (existingUser.length === 0) {
          console.log(
            `User ${id} does not exist in the database. Adding them...`
          );
          const newUser = await db
            .insert(users)
            .values({ userId: id, name: displayName });
          return done(null, newUser.rows[0]);
        }
        done(null, existingUser[0]);
      } catch (error) {
        console.log("Passport callback function error: ", error);
      }
    }
  )
);

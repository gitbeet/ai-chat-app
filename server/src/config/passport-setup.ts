import { db } from "./database";
import { eq } from "drizzle-orm";
import { profileInfo, users } from "../db/schema";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

// the user that is getting passed here is the user from the callback function (either the existingUser or the newUser)
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

// the id that is getting passed here is the id property that is getting extracted from the cookie
passport.deserializeUser(async (id: string, done) => {
  const user = await db
    .select()
    .from(profileInfo)
    .where(eq(profileInfo.userId, id));
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

        // check for existing user in the database
        const existingProfileInfo = await db
          .select()
          .from(profileInfo)
          .where(eq(profileInfo.userId, id));
        // if the user does not exist, crate one
        if (existingProfileInfo.length === 0) {
          console.log(
            `User ${id} does not exist in the database. Adding them...`
          );
          const newUserProfileInfo = await db.transaction(async (tx) => {
            await tx.insert(users).values({ id });
            const [profile] = await tx
              .insert(profileInfo)
              .values({
                userId: id,
                name: displayName,
              })
              .returning();

            return profile;
          });

          return done(null, newUserProfileInfo);
        }
        done(null, existingProfileInfo[0]);
      } catch (error) {
        console.log("Passport callback function error: ", error);
      }
    }
  )
);

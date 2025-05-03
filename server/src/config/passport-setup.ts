import { db } from "./database";
import { eq } from "drizzle-orm";
import { profileInfo } from "../db/schema";
import passport from "passport";
import googleStrategy from "../config/strategies/google-strategy";
import localStrategy from "../config/strategies/local-strategy";
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

passport.use(googleStrategy);
passport.use(localStrategy);

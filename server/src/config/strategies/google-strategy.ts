import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../database";
import { profileInfo, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const strategy = new GoogleStrategy(
  {
    // strategy options
    clientID: process.env.GOOGLE_PLUS_API_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_PLUS_API_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL}${process.env.GOOGLE_CALLBACK_URL}`,
    scope: ["profile", "email"],
  },
  // callback function , executed after getting the redirect code
  async (accessToken, refreshToken, profile, done) => {
    try {
      // get the ID and the displayName from the google profile data
      const { id, displayName, emails } = profile;
      // TODO : fix later?
      if (!emails?.[0]) {
        return done(null, false, { message: "No emails" });
      }

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
          await tx.insert(users).values({ id, email: emails[0].value });
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
);

export default strategy;

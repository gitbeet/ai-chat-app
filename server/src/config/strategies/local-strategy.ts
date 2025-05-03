import { Strategy as PassportLocalStrategy } from "passport-local";
import { db } from "../database";
import bcrypt from "bcrypt";

const strategy = new PassportLocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: true,
  },
  async (email, password, done) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: (model, { eq }) => (eq as any)(model.email, email),
      });

      // if no user found
      if (!existingUser) {
        console.error("Invalid credentials");
        return done(null, false, { message: "Invalid credentials" });
      }

      // if user is registered with another strategy (only google for now)
      if (existingUser && !existingUser?.password) {
        console.error("Email registered with another strategy");
        return done(null, false, {
          message: "This email is registered using another strategy.",
        });
      }
      // TODO : better error?
      if (!existingUser.password) {
        console.error("Server error");
        return done(null, false, { message: "Server error" });
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        console.error("Invalid credentials");
        return done(null, false, { message: "Invalid credentials" });
      }

      const profileInfo = await db.query.profileInfo.findFirst({
        where: (model, { eq }) => (eq as any)(model.userId, existingUser.id),
      });
      return done(null, profileInfo);
    } catch (error) {
      return done(null, false, { message: `Error: ${error}` });
    }
  }
);

export default strategy;

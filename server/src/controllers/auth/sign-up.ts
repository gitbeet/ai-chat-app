import { Request, Response } from "express";
import { chatClient } from "../../server";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../config/database";

const signUp = async (req: Request, res: Response): Promise<any> => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  try {
    // create user id -> example@email.com -> example_email_com
    const userId = email.replace(/[^a-zA-Z0-9_-]/g, "_");

    // check if user exists
    const userResponse = await chatClient.queryUsers({ id: { $eq: userId } });

    // if theres no such user in the stream database
    if (userResponse.users.length === 0) {
      // add new user to stream
      await chatClient.upsertUser({ id: userId, name, email, role: "user" });
    }

    // check for existing user in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    // if the user does not exist, crate one
    if (existingUser.length === 0) {
      console.log(
        `User ${userId} does not exist in the database. Adding them...`
      );
      await db.insert(users).values({ userId, name });
    }

    res.status(200).json({ userId, name, email });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default signUp;

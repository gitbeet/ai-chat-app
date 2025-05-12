import { Request, Response } from "express";
import { db } from "../../../config/database";

import bcrypt from "bcrypt";

import { v7 as uuid } from "uuid";
import { profileInfo, users } from "../../../db/schema";
import { validatePassword } from "../../../utils/validatePassword";

const signUp = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.username) {
      res.status(400).send({ error: "Bad request" });
    }

    const email = req.body.email.toLowerCase();

    const existingUser = await db.query.users.findFirst({
      where: (model, { eq }) => (eq as any)(model.email, email),
    });

    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    if (!existingUser) {
      console.log(
        `User with email ${email} does not exist in the database. Adding them...`
      );

      // checks for the password
      const result = validatePassword(req.body.password);
      if (result.error) {
        res.status(400).json({ error: result.error });
        return;
      }

      // generate uuid for user id
      const userId = uuid();
      // hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // transaction for creating both the user and the profile info
      await db.transaction(async (tx) => {
        await tx.insert(users).values({
          id: userId,
          email,
          password: hashedPassword,
        });
        await tx
          .insert(profileInfo)
          .values({
            userId,
            name: req.body.username,
          })
          .returning();
      });
      res.status(201).json({
        success: true,
        message: `User ${req.body.username} created successfully`,
      });
    }
  } catch (error) {
    res.status(500).send({ error: `Server error: ${error}` });
  }
};

export default signUp;

import { Request, Response } from "express";
import { chats } from "../../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../../config/database";

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const chatHistory = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));

    res.status(200).json({ messages: chatHistory });
  } catch (error) {
    console.log("Error getting the chat history: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

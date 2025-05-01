import { Request, Response } from "express";
import { db } from "../../config/database";
import { chats } from "../../db/schema";
import { eq } from "drizzle-orm";

export const deleteChat = async (req: Request, res: Response): Promise<any> => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    res.status(400).json({ error: "Bad request" });
  }
  try {
    const chat = db.query.chats.findFirst({
      where: (model, { eq, and }) =>
        and((eq as any)(model.id, chatId), (eq as any)(model.userId, userId)),
    });
    if (!chat) {
      return res.status(404).json({ error: "No chat found" });
    }
    await db.delete(chats).where(eq(chats.id, chatId));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

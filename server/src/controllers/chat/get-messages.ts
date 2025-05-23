import { Request, Response } from "express";
import { db } from "../../config/database";

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const chatHistory = await db.query.chats.findMany({
      where: (chats, { eq }) => (eq as any)(chats.userId, req.user?.userId),
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
      with: {
        messages: true,
      },
    });

    res.status(200).json({ chats: chatHistory });
  } catch (error) {
    console.log("Error getting the chat history: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

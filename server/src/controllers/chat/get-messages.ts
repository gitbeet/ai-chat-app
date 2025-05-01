import { Request, Response } from "express";
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
    const chatHistory = await db.query.chats.findMany({
      where: (chats, { eq }) => (eq as any)(chats.userId, userId),
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

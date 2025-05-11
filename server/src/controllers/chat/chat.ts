import { Request, Response } from "express";
import { db } from "../../config/database";

import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { openAi } from "../../server";
import { chats, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { messages as messagesSchema } from "../../db/schema";

export const chat = async (req: Request, res: Response): Promise<any> => {
  const { message, chatId } = req.body;
  const { userId } = req.user!;
  if (!message || !userId || !chatId) {
    res.status(400).json({ error: "Message,userId or chatId missing" });
  }
  try {
    // check for existing user in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    // if the user does not exist, return 404
    if (existingUser.length === 0) {
      return res.status(404).json({
        error: "User not found in the database. Please register first",
      });
    }

    // check if chat exists
    const existingChat = await db.query.chats.findFirst({
      where: (model, { eq }) => (eq as any)(model.id, chatId),
    });

    // if chat does not exist
    if (!existingChat) {
      await db
        .insert(chats)
        .values({ id: chatId, userId, name: message.slice(0, 30) });
    }

    // fetch user's past messages to pass as a context
    const messages = await db.query.messages.findMany({
      where: (model, { eq }) => (eq as any)(model.chatId, chatId),
    });

    // format the chat history for openai
    const conversation: ChatCompletionMessageParam[] = messages.flatMap(
      (chat) => [
        {
          role: "user",
          content: chat.message,
        },
        {
          role: "assistant",
          content: chat.reply,
        },
      ]
    );

    conversation.push({ role: "user", content: message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await openAi.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: conversation,
      stream: true,
    });

    let fullReply = "";

    for await (const part of response) {
      if (part.choices && part.choices[0].delta.content) {
        const chunk = part.choices[0].delta.content;
        fullReply += chunk;
        // Send raw text chunks
        res.write(chunk);
      }
    }

    await db
      .insert(messagesSchema)
      .values({ chatId, message, reply: fullReply });

    res.end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

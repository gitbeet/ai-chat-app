import { Request, Response } from "express";
import { chats, users } from "../../db/schema";
import { db } from "../../config/database";
import { eq } from "drizzle-orm";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { chatClient, openAi } from "../../server";

export const chat = async (req: Request, res: Response): Promise<any> => {
  const { message, userId } = req.body;
  if (!message || !userId) {
    res.status(400).json({ error: "Message and user are required" });
  }
  try {
    // verify user exists
    const userResponse = await chatClient.queryUsers({ id: { $eq: userId } });
    if (userResponse.users.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found. Please register first" });
    }

    // check for existing user in the database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    // if the user does not exist, return 404
    if (existingUser.length === 0) {
      return res.status(404).json({
        error: "User not found in the database. Please register first",
      });
    }

    // fetch user's past messages to pass as a context
    const chatHistory = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      // limit to the last 10 for now
      .orderBy(chats.createdAt)
      .limit(10);

    // format the chat history for openai
    const conversation: ChatCompletionMessageParam[] = chatHistory.flatMap(
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

    // push the current message we are sending to the conversation context
    conversation.push({ role: "user", content: message });

    // send the conversation to openai
    const response = await openAi.chat.completions.create({
      model: "gpt-4",
      messages: conversation,
    });

    // get the message from the response
    const aiMessage =
      response.choices[0].message?.content ?? "No response from AI";

    // save chat to the database
    await db.insert(chats).values({ userId, message, reply: aiMessage });

    // create or get channel
    const channel = chatClient.channel("messaging", `chat-${userId}`, {
      name: "AI Chat",
      created_by_id: "ai_bot",
    });

    await channel.create();
    // send the message
    await channel.sendMessage({ text: aiMessage, user_id: userId });

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

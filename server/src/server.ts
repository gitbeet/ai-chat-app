import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";
import OpenAI from "openai";
// include .js when importing a file
import { db } from "./config/database.js";
import { chats, users } from "./db/schema.js";
import { ChatCompletionMessage } from "openai/resources";
import { eq } from "drizzle-orm";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initialize openai
const openAi = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// initialize the stream client
const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

// register user with stream chat
app.post(
  "/register-user",
  async (req: Request, res: Response): Promise<any> => {
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
        await db.insert(users).values({ userId, name, email });
      }

      res.status(200).json({ userId, name, email });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// send message to AI
app.post("/chat", async (req: Request, res: Response): Promise<any> => {
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

    // send the message to openai
    const response = await openAi.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
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
});

// get chat history for a user
app.post("/get-messages", async (req: Request, res: Response): Promise<any> => {
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
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

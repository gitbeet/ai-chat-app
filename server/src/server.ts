import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import expressSession from "express-session";
import { CipherKey } from "crypto";
import passport from "passport";
import chatRoutes from "./routes/chat.js";
import baseAuthRoutes from "./routes/base-auth-routes.js";
import localAuthRoutes from "./routes/local-auth.js";
import googleAuthRoutes from "./routes/google-auth.js";
import "./config/passport-setup.js";

// load env variables
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware that creates the session cookie
app.use(
  expressSession({
    secret: process.env.COOKIE_KEY as CipherKey,
    resave: true,
    saveUninitialized: false, // GDPR
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
// get the authentication state from the session cookie
app.use(passport.session());

// initialize openai
export const openAi = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

app.use("/chat", chatRoutes);
app.use("/auth", baseAuthRoutes);
app.use("/auth/local", localAuthRoutes);
app.use("/auth/google", googleAuthRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

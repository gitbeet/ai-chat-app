import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// sign in with google route
router.get("/", passport.authenticate("google"));
// at this point we run the passport middleware to use the redirect code we get from google and fire the callback function from the passport-setup file
router.get("/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect(process.env.CLIENT_URL!);
});

export default router;

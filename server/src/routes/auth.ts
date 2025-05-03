import { Router } from "express";
import passport from "passport";
import { signOut } from "../controllers/auth/sign-out";
import { getUser } from "../controllers/auth/get-user";

const router = Router();

// get the user object
router.get("/user", getUser);
// sign in with google route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
// at this point we run the passport middleware to use the redirect code we get from google and fire the callback function from the passport-setup file
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("http://localhost:5173/");
});
router.get("/sign-out", signOut);

export default router;

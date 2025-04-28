import { Router } from "express";
// import signUp from "../controllers/auth/sign-up";
import passport from "passport";

const router = Router();

router.get("/sign-out", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out", error: err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error destroying session", error: err });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Successfully logged out" });
    });
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// at this point we run the passport middleware to use the redirect code we get from google and fire the callback function from the passport-setup file
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("http://localhost:5173/");
});

export default router;

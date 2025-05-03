import { Request, Response, NextFunction } from "express";
import passport from "passport";

const signIn = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error, user: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Manually log in the user and return a JSON response
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ success: true, user });
    });
  })(req, res, next);
};

export default signIn;

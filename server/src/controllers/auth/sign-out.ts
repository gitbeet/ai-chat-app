import { Request, Response } from "express";

export const signOut = (req: Request, res: Response) => {
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
};

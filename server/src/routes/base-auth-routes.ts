import { Router } from "express";
import { signOut } from "../controllers/auth/base/sign-out";
import getUser from "../controllers/auth/base/get-user";

const router = Router();

// get the user object
router.get("/user", getUser);
router.get("/sign-out", signOut);

export default router;

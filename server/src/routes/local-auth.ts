import { Router } from "express";

import signIn from "../controllers/auth/local/sign-in";
import signUp from "../controllers/auth/local/sign-up";

const router = Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);

export default router;

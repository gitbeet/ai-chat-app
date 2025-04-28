import { Router } from "express";
import { chat } from "../controllers/chat/chat";
import { getMessages } from "../controllers/chat/get-messages";

const router = Router();

router.post("/get-messages", getMessages);
router.post("/", chat);

export default router;

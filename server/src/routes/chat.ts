import { Router } from "express";
import { chat } from "../controllers/chat/chat";
import { getMessages } from "../controllers/chat/get-messages";
import { deleteChat } from "../controllers/chat/delete-chat";

const router = Router();

router.post("/get-messages", getMessages);
router.post("/", chat);
router.delete("/delete-chat", deleteChat);

export default router;

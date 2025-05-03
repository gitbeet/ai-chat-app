import { Router } from "express";
import { chat } from "../controllers/chat/chat";
import { getMessages } from "../controllers/chat/get-messages";
import { deleteChat } from "../controllers/chat/delete-chat";
import { checkAuthenticated } from "../utils/auth";

const router = Router();

router.post("/", checkAuthenticated, chat);
router.post("/get-messages", checkAuthenticated, getMessages);
router.delete("/delete-chat", checkAuthenticated, deleteChat);

export default router;

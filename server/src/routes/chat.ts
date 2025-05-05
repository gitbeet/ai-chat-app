import { Router } from "express";
import { chat } from "../controllers/chat/chat";
import { getMessages } from "../controllers/chat/get-messages";
import { deleteChat } from "../controllers/chat/delete-chat";
import { checkAuthenticated } from "../utils/auth";
import { renameChat } from "../controllers/chat/rename-chat";

const router = Router();

router.post("/", checkAuthenticated, chat);
router.post("/get-messages", checkAuthenticated, getMessages);
router.put("/rename-chat", checkAuthenticated, renameChat);
router.delete("/delete-chat", checkAuthenticated, deleteChat);

export default router;

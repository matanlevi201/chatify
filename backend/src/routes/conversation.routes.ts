import { Router } from "express";
import { requireAuth } from "../middlewares";
import {
  getConversations,
  getConversation,
  conversationMessages,
  createGroupConversation,
} from "../controllers/conversation.controller";
import { upload } from "../services/storage.service";

const router = Router();

router.get("/", requireAuth, getConversations);
router.get("/:id", requireAuth, getConversation);
router.get("/:id/messages", requireAuth, conversationMessages);
router.post("/", requireAuth, upload.single("avatar"), createGroupConversation);

export { router as ConversationRouter };

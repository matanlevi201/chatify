import { Router } from "express";
import { requireAuth } from "../middlewares";
import {
  getConversations,
  conversationMessages,
} from "../controllers/conversation.controller";

const router = Router();

router.get("/", requireAuth, getConversations);
router.get("/:id", requireAuth, conversationMessages);

export { router as ConversationRouter };

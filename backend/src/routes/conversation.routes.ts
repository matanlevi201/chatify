import { Router } from "express";
import { requireAuth } from "../middlewares";
import { getConversations } from "../controllers/conversation.controller";

const router = Router();

router.get("/", requireAuth, getConversations);

export { router as ConversationRouter };

import { Router } from "express";
import { clerkWebhook } from "../controllers";

const router = Router();

router.post("/clerk-webhook", clerkWebhook);

export { router as WebhooksRouter };

import { Router } from "express";
import { removeFriend, getFriends } from "../controllers";
import { requireAuth } from "../middlewares";

const router = Router();

router.get("/", requireAuth, getFriends);
router.delete("/", requireAuth, removeFriend);

export { router as FriendRouter };

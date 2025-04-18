import { Router } from "express";
import { sendRequest, acceptRequest, rejectRequest } from "../controllers";
import { requireAuth } from "../middlewares";

const router = Router();

router.post("/", requireAuth, sendRequest);
router.put("/", requireAuth, acceptRequest);
router.delete("/", requireAuth, rejectRequest);

export { router as RequestRouter };

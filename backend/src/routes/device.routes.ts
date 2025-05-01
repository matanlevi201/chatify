import { Router } from "express";
import { addDevice, getUserPublicBundle } from "../controllers";
import { requireAuth } from "../middlewares";

const router = Router();

router.post("/", requireAuth, addDevice);
router.get("/:userId", requireAuth, getUserPublicBundle);

export { router as DeviceRouter };

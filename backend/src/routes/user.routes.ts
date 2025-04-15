import { Router } from "express";
import { me } from "../controllers";
import { requireAuth } from "../middlewares";

const router = Router();

router.get("/me", requireAuth, me);

export { router as UserRouter };

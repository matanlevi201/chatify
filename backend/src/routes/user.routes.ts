import { Router } from "express";
import {
  searchUsers,
  getCurrentUser,
  setProfile,
  getUser,
} from "../controllers";
import { requireAuth } from "../middlewares";
import { upload } from "../services/storage.service";

const router = Router();

router.get("/", requireAuth, getCurrentUser);
router.get("/user/:id", requireAuth, getUser);
router.get("/search", requireAuth, searchUsers);
router.post("/profile", requireAuth, upload.single("avatar"), setProfile);

export { router as UserRouter };

import { Router } from "express";
import {
  getAvatar,
  getCurrentUser,
  setProfile,
} from "../controllers";
import { requireAuth } from "../middlewares";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, or GIF allowed."));
    }
  },
});

router.get("/", requireAuth, getCurrentUser);
router.post("/profile", requireAuth, upload.single("avatar"), setProfile);
router.get("/profile/avatar/:id", requireAuth, getAvatar);

export { router as UserRouter };

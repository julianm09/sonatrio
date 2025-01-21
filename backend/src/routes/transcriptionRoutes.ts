import { Router } from "express";
import { transcribeVideo } from "../controllers/transcriptionController";
import { uploadMiddleware } from "../middleware/multer";

const router = Router();

// Register a new user
router.post("/transcribe", uploadMiddleware, transcribeVideo);

export default router;

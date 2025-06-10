import { Router } from "express";
import { handlegenerateContent } from "../controllers/contentController";
import { uploadMiddleware } from "../middleware/multer";

const router = Router();

router.post(
	"/content/generate",
	uploadMiddleware,
	handlegenerateContent
);

export default router;

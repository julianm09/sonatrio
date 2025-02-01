import { Router } from "express";
import { handlegenerateContent } from "../controllers/contentController";
import { uploadMiddleware } from "../middleware/multer";
import checkCredits from "../middleware/checkCredits";

const router = Router();

router.post(
	"/content/generate",
	uploadMiddleware,
	checkCredits,
	handlegenerateContent
);

export default router;

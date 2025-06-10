import { Router } from "express";
import { getUserConversations } from "../controllers/conversationsController";

const router = Router();

router.get("/conversations", getUserConversations);

export default router;

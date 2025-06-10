import { Router } from "express";
import { getMessages } from "../controllers/messagesController";

const router = Router();

router.get("/messages", getMessages);

export default router;

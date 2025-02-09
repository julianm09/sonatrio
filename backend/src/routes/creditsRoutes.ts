import { Router } from "express";
import { getCredits } from "../controllers/creditsController";

const router = Router();

router.get("/credits", getCredits);

export default router;

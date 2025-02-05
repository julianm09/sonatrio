import { Router } from "express";
import {
	createSubscription,
	updateBilling,
} from "../controllers/stripeController";

const router = Router();

router.post("/create-subscription", createSubscription);
router.post("/update-billing", updateBilling);

export default router;

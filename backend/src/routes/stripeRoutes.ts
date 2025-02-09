import { Router } from "express";
import {
	createSubscription,
	updateBilling,
	cancelSubscription
} from "../controllers/stripeController";

const router = Router();

router.post("/create-subscription", createSubscription);
router.post("/update-billing", updateBilling);
router.post("/cancel-subscription", cancelSubscription);

export default router;

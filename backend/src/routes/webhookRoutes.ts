import { Router } from "express";
import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController";

const router = Router();

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	handleStripeWebhook
);

export default router;

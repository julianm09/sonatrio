import express from "express";
import { resetMonthlyCredits } from "../cron/resetMonthlyCredits";

const router = express.Router();

// ✅ API to manually trigger reset (for testing)
router.post("/test-reset-credits", async (req, res) => {
	try {
		await resetMonthlyCredits();
		res.json({ message: "Monthly credits reset successfully (Test Run)" });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

export default router;

import cron from "node-cron";
import { resetMonthlyCredits } from "./resetMonthlyCredits";

// ✅ Schedule a job to run every 5 seconds
const startCronJobs = () => {
	cron.schedule("0 0 * * *", async () => {
		console.log("🔄 Running resetMonthlyCredits()...");
		try {
			await resetMonthlyCredits();
			console.log("✅ resetMonthlyCredits() executed successfully!");
		} catch (error) {
			console.error("❌ Error executing resetMonthlyCredits():", error);
		}
	});
};

export default startCronJobs;

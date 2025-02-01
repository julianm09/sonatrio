import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";
import { getAudioCreditsFFmpeg } from "../services/getAudioCreditsFFmpeg";

const checkCredits = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// ✅ Ensure a file is included
		if (!req.file) {
			res.status(400).json({ error: "No file uploaded" });
			return;
		}

		// ✅ Extract user ID
		const { user } = req.body;

		if (!user) {
			res.status(400).json({ error: "User ID is required" });
			return;
		}

		// ✅ Determine the actual credit cost using your function
		const creditCost = await getAudioCreditsFFmpeg(
			req.file.buffer,
			req.file.originalname
		);

		if (!creditCost || creditCost <= 0) {
			res.status(500).json({ error: "Error determining credit cost" });
			return;
		}

		// ✅ Get the current month for filtering
		const today = new Date();
		const monthStart = today.toISOString().slice(0, 7) + "-01";

		// ✅ Fetch user credits
		const { data, error } = await supabase
			.from("transcription_credits")
			.select("monthly_credits, used_credits")
			.eq("user_id", user)
			.eq("month", monthStart)
			.single();

		if (error || !data) {
			res.status(500).json({ error: "Error fetching credit data" });
			return;
		}

		const { monthly_credits, used_credits } = data;
		const projectedUsage = used_credits + creditCost; // ✅ Check if new usage exceeds limit

		// ✅ Block request if credits are not sufficient
		if (projectedUsage > monthly_credits) {
			res.status(403).json({
				error: `You've reached your credit limit! You need  ${
					projectedUsage - monthly_credits
				} more credits to complete this request. Upgrade your plan or wait for the next reset.`,
			});
			return;
		}

		// ✅ If user has enough credits, proceed to the next middleware
		next();
	} catch (err) {
		console.error("❌ Middleware error in checkCredits:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default checkCredits;

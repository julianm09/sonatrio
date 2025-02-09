import { Request, Response } from "express";
import { supabase } from "../utils/supabase";

export const getCredits = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { user_id } = req.query;

		if (!user_id || typeof user_id !== "string") {
			res.status(400).json({ error: "Invalid or missing user_id" });
			return;
		}

		// Fetch conversations for the user
		const { data, error } = await supabase
			.from("transcription_credits")
			.select("monthly_credits, used_credits")
			.eq("user_id", user_id)

		if (error) {
			throw new Error(error.message);
		}

		res.status(200).json(data);
	} catch (err) {
		console.error("Error fetching conversations:", err);
		res.status(500).json({ error: "Failed to fetch conversations" });
	}
};

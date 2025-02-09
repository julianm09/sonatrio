import { Request, Response } from "express";
import { supabase } from "../utils/supabase";

export const getPricing = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		console.log("getting pricing")
		// Fetch conversations for the user
		const { data, error } = await supabase
			.from("pricing")
			.select("name, price_id, transcription_credits, monthly_price");

		if (error) {
			throw new Error(error.message);
		}

		res.status(200).json(data);
	} catch (err) {
		console.error("Error fetching pricing:", err);
		res.status(500).json({ error: "Failed to fetch pricing" });
	}
};

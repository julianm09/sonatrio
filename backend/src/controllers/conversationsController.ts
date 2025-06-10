import { Request, Response } from "express";
import { supabase } from "../utils/supabase";
import { getAuthenticatedUser } from "../utils/auth";

export const getUserConversations = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const token = req.headers.authorization || "";
		const { id: userId } = await getAuthenticatedUser(token);

		const { data, error } = await supabase
			.from("conversations")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Supabase query error:", error);
			res.status(500).json({ error: "Error retrieving conversations" });
			return;
		}

		res.status(200).json(data);
	} catch (err) {
		console.error("Unexpected error fetching conversations:", err);
		res.status(500).json({ error: "Failed to fetch conversations" });
	}
};

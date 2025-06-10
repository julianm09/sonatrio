import { Request, Response } from "express";
import { supabase } from "../utils/supabase";

export const getMessages = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { conversationId } = req.query;

		if (!conversationId || typeof conversationId !== "string") {
			res.status(400).json({
				error: "Invalid or missing conversationId",
			});
			return;
		}

		// Fetch messages for the given conversation ID
		const { data, error } = await supabase
			.from("messages")
			.select("*")
			.eq("conversation_id", conversationId)
			.order("created_at", { ascending: true });

		if (error) {
			throw new Error(error.message);
		}

		res.status(200).json(data);
		return;
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).json({ error: "Failed to fetch messages" });
		return;
	}
};

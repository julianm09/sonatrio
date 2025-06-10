import { Request, Response } from "express";
import { formatGPT } from "../services/formatGPT";
import { supabase } from "../utils/supabase";
import { getAuthenticatedUser } from "../utils/auth";
import { resolveConversationId } from "../utils/conversations";
import { resolveTranscript } from "../utils/transcript";

export const handlegenerateContent = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const token = req.headers.authorization || "";
		const { id: userId, email: userEmail } = await getAuthenticatedUser(
			token
		);

		const formats: string[] = JSON.parse(req.body.formats);
		const tone: string = req.body.tone;
		const audience: string = req.body.audience;
		const rawTranscript: string | null = req.body.transcript;
		const keywords: string[] = JSON.parse(req.body.keywords);
		const file = req.file;
		const fileName = file?.originalname || null;
		const rawConversationId: string | null =
			req.body.conversation_id || null;

		const conversationId = await resolveConversationId(
			userId,
			rawConversationId,
			fileName
		);

		const transcript = await resolveTranscript(rawTranscript, file);

		// Generate content
		const contentPromises =
			formats?.map(async (format: string) => {
				const result: string | null = await formatGPT(
					transcript,
					format,
					tone,
					audience,
					keywords
				);
				return { format, result };
			}) ?? [];

		const contentResults = await Promise.all(contentPromises);

		// Save results to database
		for (const { format, result } of contentResults) {
			if (result) {
				const { error: dbError } = await supabase
					.from("messages")
					.insert([
						{
							user_id: userId,
							conversation_id: conversationId,
							format,
							file_name: fileName,
							transcript,
							content: result,
							created_at: new Date().toISOString(),
						},
					]);

				if (dbError) {
					console.error(
						`Error saving format "${format}" to database:`,
						dbError
					);
				}
			}
		}

		res.status(200).send({
			message: "Content generation successful!",
			user: {
				id: userId,
				email: userEmail,
			},
			conversationId,
			transcript,
			content: contentResults,
		});
	} catch (error) {
		console.error("Error during processing:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

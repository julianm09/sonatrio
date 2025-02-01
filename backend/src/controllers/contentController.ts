import { Request, Response } from "express";
import { transcribeFile } from "../services/transcribeFile";
import { formatGPT } from "../services/formatGPT";
import { supabase } from "../utils/supabase";
import { getAudioCreditsFFmpeg } from "../services/getAudioCreditsFFmpeg";
import { updateCredits } from "../services/updateCredits";

export const handlegenerateContent = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// Extract and validate the Authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			res.status(401).send({
				message: "Missing or invalid Authorization header",
			});
			return;
		}

		const token = authHeader.split(" ")[1]; // Extract the token

		const { data, error: authError } = await supabase.auth.getUser(token);

		if (authError || !data.user) {
			res.status(401).send({ message: "Invalid or expired token" });
			return;
		}

		const user = data.user; // Now `user` is of type `User`

		// Extract inputs from the request body
		const formats: string[] = JSON.parse(req.body.formats);
		const tone: string = req.body.tone;
		const audience: string = req.body.audience;
		let transcript: string | null = req.body.transcript;
		const keywords: string[] = JSON.parse(req.body.keywords);
		const file = req.file;

		if (file && user) {
			const creditCost = await getAudioCreditsFFmpeg(
				file.buffer,
				file.originalname
			);

			// ✅ Deduct 1 credit for the transcription
			const creditUpdate = await updateCredits(user.id, creditCost); // Adjust credit usage

			if (creditUpdate.error) {
				res.status(500).json({ error: "Failed to update credits" });
			}
		}

		const fileName = file?.originalname;

		// Get conversation ID from request, or create a new conversation
		let conversationId: string | null = req.body.conversation_id || null;

		if (!conversationId) {
			const { data: newConversation, error: newConversationError } =
				await supabase
					.from("conversations") // Replace with your conversation table name
					.insert([
						{
							user_id: user.id, // Link conversation to the user
							created_at: new Date().toISOString(),
							name: fileName,
						},
					])
					.select("id")
					.single(); // Expecting only one row to be returned

			if (newConversationError) {
				console.error(
					"Error creating conversation:",
					newConversationError
				);
				res.status(500).send({
					message: "Error creating conversation",
				});
				return;
			}

			conversationId = newConversation.id;
		}

		// If transcript is not provided, check for uploaded file
		if (!transcript) {
			if (!file) {
				res.status(400).send({
					message: "No transcript or file provided!",
				});
				return;
			}

			// Generate transcript from file
			transcript = await transcribeFile(file.buffer);

			if (!transcript) {
				res.status(500).send({ message: "Transcription failed!" });
				return;
			}
		}

		// Generate content for each format
		const contentPromises =
			formats?.map(async (format: string) => {
				const result: string | null = await formatGPT(
					transcript,
					format,
					tone,
					audience,
					keywords
				);
				return { format, result }; // Include both format and result
			}) ?? [];

		// Wait for all promises to resolve
		const contentResults = await Promise.all(contentPromises);

		// Write each format and its result to the database
		for (const { format, result } of contentResults) {
			if (result) {
				const { error: dbError } = await supabase
					.from("messages") // Replace with your table name
					.insert([
						{
							user_id: user.id, // Link content to the authenticated user
							conversation_id: conversationId, // Link to the specific conversation
							format,
							file_name: fileName,
							transcript,
							content: result, // Store the result for this format
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

		// Send the response
		res.status(200).send({
			message: "Content generation successful!",
			user: {
				id: user.id,
				email: user.email,
			},
			conversationId,
			transcript,
			content: contentResults, // Return all generated content
		});
	} catch (error) {
		console.error("Error during processing:", error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};

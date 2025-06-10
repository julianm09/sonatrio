import { transcribeFile } from "../services/transcribeFile";

// utils/transcript.ts
export const resolveTranscript = async (
	rawTranscript: string | null,
	file?: Express.Multer.File
): Promise<string> => {
	if (rawTranscript) return rawTranscript;
	if (!file) throw new Error("No transcript or file provided");

	const transcript = await transcribeFile(file.buffer);
	if (!transcript) throw new Error("Transcription failed");

	return transcript;
};

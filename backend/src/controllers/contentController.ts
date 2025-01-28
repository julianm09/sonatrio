import { Request, Response } from "express";
import { transcribeFile } from "../services/transcribeFile";
import { formatGPT } from "../services/formatGPT";

export const handlegenerateContent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const formats = JSON.parse(req.body.formats);
        const tone = req.body.tone;
        const audience = req.body.audience;
        let transcript = req.body.transcript;

        // If transcript is not provided, check for uploaded file
        if (!transcript) {
            const file = req.file;

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

        const contentPromises =
            formats?.map(async (format: string) => {
                const result: string | null = await formatGPT(
                    transcript,
                    format,
                    tone,
                    audience
                );
                return { format, result }; // Include both format and result
            }) ?? [];

        // Wait for all promises to resolve
        const contentResults = await Promise.all(contentPromises);

        // Transform the results into an object with nested objects
        const content = contentResults.reduce((acc, { format, result }) => {
            if (result !== null) {
                acc[format] = {
                    format, // Include the format name
                    result, // Include the generated content
                };
            }
            return acc;
        }, {} as Record<string, { format: string; result: string }>);

        // Send the response
        res.status(200).send({
            message: "Content generation successful!",
            transcript: transcript,
            content: content, // Use the populated content array
        });
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

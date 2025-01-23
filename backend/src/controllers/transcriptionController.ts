import { Request, Response } from "express";
import { transcribeFile } from "../services/transcribeFile";
import { formatGPT } from "../services/formatGPT";

export const handlegenerateContent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const format = req.body.format;
        let transcript = req.body.transcript;

        // If transcript is not provided, check for uploaded file
        if (!transcript) {
            const file = req.file;

            if (!file) {
                res.status(400).send({ message: "No transcript or file provided!" });
                return;
            }

            // Generate transcript from file
            transcript = await transcribeFile(file.buffer);

            if (!transcript) {
                res.status(500).send({ message: "Transcription failed!" });
                return;
            }
        }

        // Generate content from the transcript and format
        const content = await formatGPT(transcript, format);

        // Respond with the transcript and formatted content
        res.status(200).send({
            message: "Content generation successful!",
            transcript: transcript,
            content: content,
        });
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
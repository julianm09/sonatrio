import { Request, Response } from "express";
import multer from "multer";
import { transcribeFile } from "../services/transcribeFile";
import { openai } from "../utils/openai";

// Configure multer storage
const upload = multer({ dest: "uploads/" }); // Files will be saved in the "uploads" directory

export const transcribeVideo = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Access the file (req.file is populated by multer)
        const file = req.file;
        const format = req.file;

        if (!file) {
            res.status(400).send({ message: "No file uploaded!" });
            return;
        }

        console.log("Uploaded file:", file.originalname);

        // Call the transcribeFile function with the file buffer
        const transcript = await transcribeFile(file.buffer);

        if (!transcript) {
            res.status(500).send({ message: "Transcription failed!" });
            return;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                {
                    role: "developer",
                    content: `please convert ${transcript} to ${format} with markdown formatting`,
                },
            ],
        });

        console.log(completion.choices[0]);

        // Respond with a success message
        res.status(200).send({
            message: "Transcription successful!",
            transcript: transcript,
            content: completion.choices[0].message.content,
        });
    } catch (error) {
        console.error("Error during transcription:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

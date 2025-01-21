import { createClient } from "@deepgram/sdk";

export const transcribeFile = async (
    fileBuffer: Buffer
): Promise<string | null> => {
    try {
        // STEP 1: Create a Deepgram client using the API key
        const deepgram = createClient(process.env.DEEPGRAM_SECRET_KEY);

        // STEP 2: Transcribe the file
        const { result, error } =
            await deepgram.listen.prerecorded.transcribeFile(
                fileBuffer, // Pass the file buffer directly
                {
                    model: "nova-2",
                    smart_format: true,
                }
            );

        // STEP 3: Handle any errors
        if (error) throw error;

        // STEP 4: Extract and return the transcript
        return result?.results.channels[0].alternatives[0].transcript || null;
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error occurred:", err.message);
        } else {
            console.error("An unknown error occurred.");
        }
        return null;
    }
};

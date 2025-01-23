import { openai } from "../utils/openai";

export const formatGPT = async (
    transcript: string,
    format: string
): Promise<string | null> => {
    try {
        if (format === "transcript") {
            return transcript;
        }

        // Define a mapping of formats to their descriptions
        const formatPrompts: Record<string, string> = {
            "blog-post": `Convert the following transcript to a blog post with rich text: ${transcript}`,
            "ad-copy": `Convert the following transcript to ad copy: ${transcript}`,
            "instagram-post": `Convert the following transcript to a Instagram post: ${transcript}`,
            "facebook-post": `Convert the following transcript to a Facebook post: ${transcript}`,
            "tiktok-script": `Convert the following transcript to a TikTok script: ${transcript}`,
            "youtube-script": `Convert the following transcript to a YouTube script: ${transcript}`,
            "linkedin-post": `Convert the following transcript to a LinkedIn post: ${transcript}`,
            "tutorial": `Convert the following transcript to a tutorial: ${transcript}`,
            "study-guide": `Convert the following transcript to a study guide: ${transcript}`,
        };

        // Check if the format is supported
        if (!formatPrompts[format]) {
            throw new Error(`Unsupported format: ${format}`);
        }

        // Use the corresponding content prompt
        const content = formatPrompts[format];

        // Call OpenAI's API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { role: "system", content: "You are a copywriter for a marketing agency." },
                { role: "user", content: content },
            ],
        });

        // Return the generated content
        return completion.choices[0].message.content;
    } catch (err) {
        console.error(
            "Error occurred:",
            err instanceof Error ? err.message : err
        );
        return null;
    }
};

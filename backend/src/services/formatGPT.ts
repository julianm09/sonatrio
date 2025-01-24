import { openai } from "../utils/openai";

export const formatGPT = async (
    transcript: string,
    format: string,
    tone: string,
    audience: string
): Promise<string | null> => {
    try {
        // Build the dynamic base prompt
        let basePrompt = `Convert the following transcript`;
        if (audience) basePrompt += ` for a ${audience} audience`;
        if (tone) basePrompt += ` in a ${tone} tone`;
        if (format) basePrompt += `. The format should be a ${format}`;

        if (tone === "original-source") {
            basePrompt = `Convert the following transcript keeping the tone, language, punctuation and level used as close as possible to the source text (even if bad words). The format should be a ${format}.`;
        }

        if (format === "transcript") {
            basePrompt = ``;
        }

        // Define specific format instructions
        const formatPrompts: Record<string, string> = {
            "blog-post": `Write a well-structured blog post with headings, subheadings, and rich text: ${transcript}`,
            "ad-copy": `Create engaging ad copy: ${transcript}`,
            "instagram-post": `Craft a compelling Instagram post with hashtags and emojis: ${transcript}`,
            "facebook-post": `Write an engaging Facebook post: ${transcript}`,
            "tiktok-script": `Create a script for a short and engaging TikTok video: ${transcript}`,
            "youtube-script": `Write a detailed script for a YouTube video: ${transcript}`,
            "linkedin-post": `Compose a professional LinkedIn post: ${transcript}`,
            "tutorial": `Write a step-by-step tutorial: ${transcript}`,
            "transcript": `Format the following into readable paragraphs without changing wording or punctuation: ${transcript}`,
            "study-guide": `Create a concise and structured study guide: ${transcript}`,
        };

        // Check if the format is supported
        if (!formatPrompts[format]) {
            throw new Error(`Unsupported format: ${format}`);
        }

        // Combine the base prompt with format-specific instructions
        const content = `${basePrompt} ${formatPrompts[format]}`;

        // Call OpenAI's API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                {
                    role: "system",
                    content: "You are a professional content generator.",
                },
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

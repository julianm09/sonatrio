import { openai } from "../utils/openai";

export const formatGPT = async (
	transcript: string | null,
	format: string,
	tone: string | null,
	audience: string | null,
	keywords?: string[] | null
): Promise<string | null> => {
	try {
		// Build the dynamic base prompt
		let basePrompt = `Convert the following transcript`;
		if (audience) basePrompt += ` for a ${audience} audience`;
		if (format) basePrompt += `. The format should be a ${format}`;

		if (tone) {
			if (tone === "original-source") {
				basePrompt += `Keep the tone, language, punctuation, and level as close as possible to the source text (even if it contains informal or explicit language).`;
			} else {
				basePrompt += ` in a ${tone} tone`;
			}
		}

		if (Array.isArray(keywords) && keywords.length > 0) {
			basePrompt += `Ensure the content naturally includes the following keywords: ${keywords.join(
				", "
			)}.`;
		}

		if (format === "transcript") {
			return transcript;
		}

		// Define specific format instructions
		const formatPrompts: Record<string, string> = {
			"blog-post": `Write a well-structured blog post with headings, subheadings, and rich text. Ensure it has an engaging introduction, informative body sections, and a strong conclusion. The content should be SEO-friendly and formatted professionally. Use the following content as a reference: ${transcript}`,

			"ad-copy": `Craft a compelling and persuasive ad copy that grabs attention and drives action. Ensure the messaging is clear, engaging, and suited for marketing purposes. Consider different formats:
			
			  1. **Short Social Media Ad**: A punchy one-liner or brief sentence designed to quickly engage users.
			  2. **Google Search Ad**: A well-structured ad with a strong headline, description, and call-to-action.
			  3. **Facebook/Instagram Ad**: An engaging hook with a benefit-driven description and a CTA.
			
				Use the following content as inspiration: ${transcript}`,

			"instagram-post": `Create an engaging Instagram post that captures attention and encourages interaction. Ensure the caption is concise, engaging, and relevant to the audience. Consider:
			
				- A compelling hook to grab attention.
				- A clear message that aligns with the post’s intent.
				- A strong call-to-action (e.g., "Comment below," "Tag a friend," "Click the link in bio").
				- (Optional) Suggested hashtags.
			
				Use the following content as the basis for the caption: ${transcript}`,

			"linkedin-post": `Write a professional and engaging LinkedIn post that conveys valuable insights, sparks discussions, or highlights key takeaways. Structure it with:
			
				- A compelling opening line to capture attention.
				- A well-structured body that delivers value.
				- A closing statement or question to encourage engagement.
				- A clear call-to-action if relevant (e.g., "Share your thoughts in the comments" or "Visit the link for more details").
			
				Use the following content as the foundation: ${transcript}`,

			"summary": `Generate a concise and informative summary that captures the key points and main insights from the transcript. Ensure it is clear, structured, and easy to understand. Focus on:
			
				- The main topic or theme.
				- Key takeaways or important details.
				- Any action points or conclusions.
			
				Here is the content to summarize: ${transcript}`,
			"website-copy": `Craft clear, engaging, and professional website copy using the following information. Provide detailed instructions for where and how the content should be placed on the website:
			
			  1. **Homepage**: Write an attention-grabbing headline and a brief introductory paragraph that highlights the key message or purpose of the website.
			  2. **About Page**: Summarize the background, mission, and values in a professional tone.
			  3. **Services/Products Page**: Provide concise descriptions of each service or product, emphasizing benefits and key features.
			  4. **Contact Page**: Create a friendly and professional call-to-action encouraging users to get in touch, along with clear instructions on what to include.
			  5. **Footer**: Suggest a tagline or concise summary for the footer that reinforces the brand message.

				Use the following content as the basis for crafting the website copy: ${transcript}`,

			"github-readme": `Create a well-structured GitHub README file that provides clear documentation for the project. Include the following sections:
			
			  1. **Project Title**: Clearly state the project name.
			  2. **Description**: Provide a concise summary of what the project does and its purpose.
			  3. **Installation**: Step-by-step instructions on how to install and set up the project.
			  4. **Usage**: Explain how to use the project, including relevant commands or examples.
			  5. **Configuration**: Mention any necessary configurations, environment variables, or settings.
			  6. **Contributing**: Guidelines for contributing to the project.
			  7. **License**: Specify the license information.
			  8. **Credits**: Acknowledge contributors or resources used.
			
				Use the following content as the basis for crafting the README: ${transcript}`,
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

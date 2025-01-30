import axios from "axios";
import { getAuthToken } from "./authToken";

// Generate content with Supabase token attached
export const generateContent = async (formData: FormData) => {
	try {
		// Get the auth token
		const token = await getAuthToken();

		if (!token) {
			throw new Error("User is not authenticated. Unable to proceed.");
		}

		// Make the API call with the token in the headers
		const response = await axios.post(
			`https://sonatrio-cjckqw.fly.dev/api/content/generate`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			// Axios-specific error
			console.error(
				"Error generating content:",
				err.response?.data || err.message
			);
			throw new Error(
				err.response?.data?.message ||
					"Failed to generate content. Please try again."
			);
		} else if (err instanceof Error) {
			// Generic JavaScript error
			console.error("Error generating content:", err.message);
			throw new Error(err.message);
		} else {
			// Unknown error
			console.error("Unknown error generating content:", err);
			throw new Error("An unknown error occurred. Please try again.");
		}
	}
};

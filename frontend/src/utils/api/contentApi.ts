import axios from "axios";
import { getAuthToken } from "./authToken";

export const API_BASE_URL_LOCAL = "http://localhost:8000";
export const API_BASE_URL = "https://sonatrio-cjckqw.fly.dev";

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
			`${API_BASE_URL_LOCAL}/api/content/generate`,
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
		// Handle Axios-specific errors
		if (axios.isAxiosError(err)) {
			return {
				error:
					err.response?.data?.error ||
					"Failed to generate content. Please try again.",
				status: err.response?.status || 500, // Include HTTP status code
			};
		}

		// Handle generic JavaScript errors
		if (err instanceof Error) {
			return { error: err.message };
		}

		// Handle unknown errors
		return { error: "An unknown error occurred. Please try again." };
	}
};

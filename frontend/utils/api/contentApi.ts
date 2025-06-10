import axios from "axios";
import { getAuthToken } from "./authToken";

export const API_BASE_URL_LOCAL = "http://localhost:5001";

export const generateContent = async (formData: FormData) => {
	try {
		const token = await getAuthToken();
		if (!token) throw new Error("User is not authenticated.");

		const response = await axios.post(
			`${API_BASE_URL_LOCAL}/api/content/generate`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			return {
				error: err.response?.data?.error || "Failed to generate content.",
				status: err.response?.status || 500,
			};
		}

		return {
			error: err instanceof Error
				? err.message
				: "An unknown error occurred.",
		};
	}
};

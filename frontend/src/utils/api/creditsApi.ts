import axios from "axios";
import { API_BASE_URL_LOCAL } from "./contentApi";

export const fetchCredits = async (userId: string | undefined) => {
	try {
		const response = await axios.get(`${API_BASE_URL_LOCAL}/api/credits`, {
			params: { user_id: userId },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching conversations:", error);
		throw new Error("Failed to fetch conversations.");
	}
};

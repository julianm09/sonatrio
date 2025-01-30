import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const fetchConversations = async (userId: string) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/api/conversations`, {
			params: { user_id: userId },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching conversations:", error);
		throw new Error("Failed to fetch conversations.");
	}
};

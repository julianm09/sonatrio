import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const fetchMessages = async (conversationId: string) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/api/messages`, {
			params: { conversationId },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching messages:", error);
		throw new Error("Failed to fetch messages.");
	}
};

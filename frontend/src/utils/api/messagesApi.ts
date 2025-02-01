import axios from "axios";
import { API_BASE_URL_LOCAL } from "./contentApi";

export const fetchMessages = async (conversationId: string) => {
	try {
		const response = await axios.get(`${API_BASE_URL_LOCAL}/api/messages`, {
			params: { conversationId },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching messages:", error);
		throw new Error("Failed to fetch messages.");
	}
};

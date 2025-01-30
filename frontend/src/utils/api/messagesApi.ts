import axios from "axios";

export const fetchMessages = async (conversationId: string) => {
	try {
		const response = await axios.get(`https://sonatrio-cjckqw.fly.dev/api/messages`, {
			params: { conversationId },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching messages:", error);
		throw new Error("Failed to fetch messages.");
	}
};

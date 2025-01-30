import axios from "axios";

export const fetchConversations = async (userId: string) => {
	try {
		const response = await axios.get(`https://sonatrio-cjckqw.fly.dev/api/conversations`, {
			params: { user_id: userId },
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching conversations:", error);
		throw new Error("Failed to fetch conversations.");
	}
};

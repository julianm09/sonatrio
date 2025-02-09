import axios from "axios";
import { API_BASE_URL_LOCAL } from "./contentApi";

export const fetchConversations = async (userId: string) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL_LOCAL}/api/conversations`,
			{
				params: { user_id: userId },
			}
		);
		return response.data;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch conversations.");
	}
};

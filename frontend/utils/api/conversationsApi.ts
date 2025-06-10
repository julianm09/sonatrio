import axios from "axios";
import { supabase } from "../../lib/supabase";
import { API_BASE_URL_LOCAL } from "./contentApi";

export const fetchConversations = async (userId: string) => {
	try {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error || !session?.access_token) {
			throw new Error("User is not authenticated");
		}

		const response = await axios.get(
			`${API_BASE_URL_LOCAL}/api/conversations`,
			{
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
				params: { user_id: userId },
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error fetching conversations:", error);
		throw new Error("Failed to fetch conversations.");
	}
};

import { supabase } from "@/lib/supabaseClient";

// Fetch the Supabase authentication token
export const getAuthToken = async (): Promise<string | null> => {
	try {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (error || !session) {
			console.error("Error fetching session:", error?.message);
			return null;
		}

		return session.access_token;
	} catch (err) {
		if (err instanceof Error) {
			console.error("Error retrieving auth token:", err.message);
		} else {
			console.error("Unknown error retrieving auth token:", err);
		}
		return null;
	}
};

import { supabase } from "@/lib/supabase";

export const getAuthToken = async (): Promise<string | null> => {
	try {
		const { data, error } = await supabase.auth.getSession();
		if (error || !data.session) {
			console.error("Error fetching session:", error?.message);
			return null;
		}
		return data.session.access_token;
	} catch (err) {
		console.error("Error retrieving auth token:", err instanceof Error ? err.message : err);
		return null;
	}
};
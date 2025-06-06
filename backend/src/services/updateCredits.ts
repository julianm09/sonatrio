import { supabase } from "../utils/supabase";

export const updateCredits = async (user_id: string, creditsUsed: number) => {
	const today = new Date();
	const monthStart = today.toISOString().slice(0, 7) + "-01";

	// Get current used credits
	const { data, error } = await supabase
		.from("transcription_credits")
		.select("used_credits")
		.eq("user_id", user_id)
		.eq("month", monthStart)
		.single();

	if (error || !data) {
		return { error: "Error fetching credit data" };
	}

	const updatedCredits = data.used_credits + creditsUsed;

	// Update the used credits
	const { error: updateError } = await supabase
		.from("transcription_credits")
		.update({ used_credits: updatedCredits })
		.eq("user_id", user_id)
		.eq("month", monthStart);

	if (updateError) {
		return { error: "Error updating used credits" };
	}

	return { success: true };
};

import { supabase } from "../utils/supabase";

export const resolveConversationId = async (
	userId: string,
	providedId: string | null,
	fileName: string | null
): Promise<string> => {
	if (providedId) {
		const { data, error } = await supabase
			.from("conversations")
			.select("id")
			.eq("id", providedId)
			.eq("user_id", userId)
			.single();

		if (data && !error) return data.id;
	}

	const { data: created, error } = await supabase
		.from("conversations")
		.insert([{ user_id: userId, name: fileName, created_at: new Date().toISOString() }])
		.select("id")
		.single();

	if (!created || error) {
		throw new Error("Failed to create conversation");
	}

	return created.id;
};

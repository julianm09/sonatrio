import { supabase } from "../utils/supabase";
import { logError } from "../utils/logger";

type UserTier = "free" | "standard" | "pro";

const tierLimits: Record<UserTier, number> = {
	free: 30,
	standard: 1200,
	pro: 3000,
};

export async function resetMonthlyCredits() {
	console.log(
		"🔄 Checking if users need their monthly transcription credits reset..."
	);

	// Fetch all users with their tiers
	const { data: users, error: userError } = await supabase
		.from("users")
		.select("user_id, tier");

	if (userError) {
		logError("Fetching Users", userError);
		return;
	}

	console.log(users);

	// Fetch all subscription update dates in a single query
	const { data: subscriptions, error: subError } = await supabase
		.from("subscriptions")
		.select("user_id, updated_at");

	if (subError) {
		logError("Fetching Subscriptions", subError);
		return;
	}

	const today = new Date();
	const updates = [];

	// Convert subscriptions to a map for fast lookup
	const subscriptionMap = new Map(
		subscriptions.map((sub) => [sub.user_id, new Date(sub.updated_at)])
	);

	for (const user of users) {
		const tier = (user.tier as UserTier) || "free";
		const newMonthlyCredits = tierLimits[tier];

		const subscriptionDate = subscriptionMap.get(user.user_id);

		if (!subscriptionDate) {
			console.warn(
				`⚠️ User ${user.user_id} has no subscription update date, skipping...`
			);
			continue;
		}

		const subscriptionDay = subscriptionDate.getUTCDate();
		const subscriptionMonth = 2;
		const subscriptionYear = subscriptionDate.getUTCFullYear();

		// Check if today is the reset date
		if (
			today.getUTCDate() === subscriptionDay &&
			(today.getUTCMonth() !== subscriptionMonth ||
				today.getUTCFullYear() !== subscriptionYear)
		) {
			updates.push({
				user_id: user.user_id,
				monthly_credits: newMonthlyCredits,
				month: today.toISOString().slice(0, 7) + "-01",
				used_credits: 0,
			});
		}
	}

	// Bulk upsert all updates at once
	if (updates.length > 0) {
		const { data, error } = await supabase
			.from("transcription_credits")
			.upsert(updates, { onConflict: "user_id" })
			.select("*");

		if (error) {
			console.error("❌ Error updating credits in bulk:", error.message);
		} else {
			console.log(
				`✅ Successfully updated credits for ${updates.length} users`
			);
		}
	} else {
		console.log("✅ No users needed credit reset today.");
	}
}

import { supabase } from "../utils/supabase";
import { logError } from "../utils/logger";

type UserTier = "free" | "pro" | "business";

const tierLimits: Record<UserTier, number> = {
	free: 30,
	pro: 1200,
	business: 3000,
};

export async function resetMonthlyCredits() {
	console.log(
		"🔄 Checking if users need their monthly transcription credits reset..."
	);

	const { data: users, error } = await supabase
		.from("users")
		.select("user_id, tier, subscription_start_date");

	if (error) {
		logError("Fetching Users", error);
		return;
	}

	const today = new Date();

	for (const user of users) {
		const tier = (user.tier as UserTier) || "free";
		const newMonthlyCredits = tierLimits[tier];

		// Ensure the user has a subscription start date
		if (!user.subscription_start_date) {
			console.warn(
				`⚠️ User ${user.user_id} has no subscription start date, skipping...`
			);
			continue;
		}

		const subscriptionDate = new Date(user.subscription_start_date);
		const subscriptionDay = subscriptionDate.getUTCDate();
		const subscriptionMonth = subscriptionDate.getUTCMonth();
		const subscriptionYear = subscriptionDate.getUTCFullYear();

		// Check if today is the user's subscription reset date
		if (
			today.getUTCDate() === subscriptionDay &&
			(today.getUTCMonth() !== subscriptionMonth ||
				today.getUTCFullYear() !== subscriptionYear)
		) {
			const { data, error } = await supabase
				.from("transcription_credits")
				.upsert(
					[
						{
							user_id: user.user_id, // ✅ Ensure user_id is correct
							monthly_credits: newMonthlyCredits, // ✅ Ensure this is being updated
							month: today.toISOString().slice(0, 7) + "-01",
							used_credits: 0,
						},
					],
					{ onConflict: "user_id, month" }
				)
				.select("*"); // 🔥 This ensures the updated row is returned

			if (error) {
				console.error(
					`❌ Error updating credits for user ${user.user_id}:`,
					error.message
				);
			} else {
				console.log(
					`✅ Successfully updated credits for user ${user.user_id}:`,
					data
				);
			}
		}
	}
}

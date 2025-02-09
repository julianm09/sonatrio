import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import styles from "./Credits.module.scss";
import { fetchCredits } from "@/utils/api/creditsApi";

interface Credits {
	monthly_credits: number;
	used_credits: number;
}

interface CreditsProps {
	userId: string | undefined;
}

const Credits: React.FC<CreditsProps> = ({ userId }) => {
	const [credits, SetCredits] = useState<Credits[]>([]);

	console.log(credits);

	useEffect(() => {
		const loadConversations = async () => {
			try {
				const data = await fetchCredits(userId);
				SetCredits(data);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
				}
			}
		};

		if (userId) {
			loadConversations();

			// Define the expected shape of the credits object
			interface Credits {
				monthly_credits: number;
				used_credits: number;
			}

			// Subscribe to real-time updates for the user's transcription credits
			const channel = supabase
				.channel(`user_transcription_credits:${userId}`)
				.on(
					"postgres_changes",
					{
						event: "*", // Listen for INSERT, UPDATE, DELETE
						schema: "public",
						table: "transcription_credits",
					},
					(payload) => {
						const newCreditData = payload.new as Credits;

						// Ensure we always store an array with a single object
						SetCredits([
							{
								used_credits: newCreditData.used_credits,
								monthly_credits: newCreditData.monthly_credits,
							},
						]);
					}
				)
				.subscribe();

			return () => {
				supabase.removeChannel(channel);
			};
		}
	}, [userId]);

	let creditsLeft = 0;
	let monthlyCredits = 0;

	if (credits.length > 0) {
		creditsLeft = credits[0].monthly_credits - credits[0].used_credits;
		monthlyCredits = credits[0].monthly_credits;
	}

	return (
		<div className={styles.credits}>
			Monthly Credits: {creditsLeft} / {monthlyCredits}
		</div>
	);
};

export default Credits;

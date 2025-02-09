// /hooks/useUserSubscription.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "@/context/UserContext";

interface Subscription {
	stripe_customer_id: string;
	stripe_subscription_id: string;
	stripe_session_id: string;
	price_id: string;
	status: string;
}

export const useUserSubscription = () => {

	const { user } = useUserContext();
	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;

		const fetchSubscription = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("subscriptions")
				.select(
					"stripe_customer_id, stripe_subscription_id, stripe_session_id, price_id, status"
				)
				.eq("user_id", user.id)
				.single();

			if (error) {
				return;
			} else {
				setSubscription(data);
			}
			setLoading(false);
		};

		fetchSubscription();

		// Real-time updates
		const channel = supabase
			.channel(`subscription-updates-${user.id}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "subscriptions",
					filter: `user_id=eq.${user.id}`,
				},
				(payload) => {
					console.log("Subscription updated:", payload);
					setSubscription(payload.new as Subscription);
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [user]);

	return { subscription, loading };
};

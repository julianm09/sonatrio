// /hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "@/context/UserContext";

interface UserProfile {
	user_id: string;
	name: string;
	email: string;
	tier?: string;
}

export const useUserProfile = () => {
	const { user } = useUserContext();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;

		const fetchUserProfile = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("users")
				.select("user_id, name, email, tier")
				.eq("user_id", user.id)
				.single();

			if (error) {
				console.error("Error fetching user profile:", error);
			} else {
				setProfile(data);
			}
			setLoading(false);
		};

		fetchUserProfile();

		// Real-time updates
		const channel = supabase
			.channel(`user-updates-${user.id}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "users",
					filter: `user_id=eq.${user.id}`,
				},
				(payload) => {
					console.log("User profile updated:", payload);
					setProfile(payload.new as UserProfile);
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [user]);

	return { profile, loading };
};

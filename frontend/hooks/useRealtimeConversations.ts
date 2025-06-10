import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Conversation {
	id: string;
	user_id: string;
	created_at: string;
	name: string;
}

export function useRealtimeConversations(
	userId: string,
	onNewConversation: (conv: Conversation) => void
) {
	const channelRef = useRef<any>(null);

	useEffect(() => {
		if (!userId || channelRef.current) return;

		const channel = supabase
			.channel("conversations")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "conversations",
					filter: `user_id=eq.${userId}`,
				},
				(payload) => {
					onNewConversation(payload.new as Conversation);
				}
			)
			.subscribe((status) => {
				console.log("Subscription status:", status);
			});

		channelRef.current = channel;

		return () => {
			if (channelRef.current) {
				supabase.removeChannel(channelRef.current);
				channelRef.current = null;
			}
		};
	}, [userId, onNewConversation]);
}

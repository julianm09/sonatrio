"use client";

import { supabase } from "@/lib/supabase";
import { fetchConversations } from "@/utils/api/conversationsApi";
import { useEffect, useRef, useState } from "react";
import styles from "./Conversations.module.scss";
import { useMessageContext } from "@/context/MessageContext";

interface Conversation {
	id: string;
	user_id: string;
	created_at: string;
	name: string;
}

interface ConversationsProps {
	userId: string;
	isCollapsed: boolean;
}

const Conversations: React.FC<ConversationsProps> = ({
	userId,
	isCollapsed,
}) => {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const { currentConversation, setCurrentConversation } = useMessageContext();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

	useEffect(() => {
		console.log("run");

		const loadConversations = async () => {
			try {
				const data = await fetchConversations(userId);
				setConversations(data);
			} catch (err) {
				setError("Can't find sessions");
			}
			setLoading(false);
		};

		const setupRealtime = () => {
			channelRef.current = supabase
				.channel(`conversations-${userId}`)
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "conversations",
						filter: `user_id=eq.${userId}`,
					},
					(payload) => {
						setConversations((prev) => [
							payload.new as Conversation,
							...prev,
						]);
						console.log(payload);
					}
				)
				.subscribe((status) => {
					console.log("Subscription status:", status);
				});
		};

		if (userId) {
			loadConversations();
			setupRealtime();
		}

		return () => {
			if (channelRef.current) {
				supabase.removeChannel(channelRef.current);
				channelRef.current = null;
			}
			console.log("unmounted");
		};
	}, [userId]);

	const handleCurrentConversation = (id: string) => {
		setCurrentConversation(id);
	};

	return (
		<div
			className={`${styles["container"]} ${
				isCollapsed ? styles["hidden"] : ""
			}`}
		>
			<div className={styles["label"]}>Session</div>

			{conversations.length > 0 && (
				<div className={styles["conversation-container"]}>
					{conversations.map((conversation) => (
						<div
							key={conversation.id}
							className={`${styles["conversation"]} ${
								currentConversation === conversation.id
									? styles["active"]
									: ""
							}`}
							onClick={() =>
								handleCurrentConversation(conversation.id)
							}
						>
							<p>{conversation.name}</p>
						</div>
					))}
				</div>
			)}

			{loading && (
				<div className={styles["conversation-container"]}>
					<div className={styles["loading"]}>Loading...</div>
				</div>
			)}

			{error && (
				<div className={styles["conversation-container"]}>
					<div className={styles["error"]}>{error}</div>
				</div>
			)}
		</div>
	);
};

export default Conversations;

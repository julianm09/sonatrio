import { supabase } from "@/lib/supabaseClient";
import { fetchConversations } from "@/utils/api/conversationsApi";
import { useEffect, useState } from "react";
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

	useEffect(() => {
		const loadConversations = async () => {
			try {
				const data = await fetchConversations(userId);
				setConversations(data);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
				}
			}
		};

		loadConversations();

		// Subscribe to real-time updates
		const channel = supabase
			.channel(`user_conversations:${userId}`)
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
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userId]);

	const handleCurrentConversation = (id: string) => {
		setCurrentConversation(id);
	};

	return (
		<div
			className={`${styles["container"]} ${
				isCollapsed && styles["hidden"]
			}`}
		>
			<>
				<div className={styles["label"]}>Session</div>
				<div className={styles["conversation-container"]}>
					{conversations.map((conversation) => (
						<div
							key={conversation.id}
							className={`${styles["conversation"]} ${
								currentConversation === conversation.id &&
								styles["active"]
							}`}
							onClick={() =>
								handleCurrentConversation(conversation.id)
							}
						>
							<p>{conversation.name}</p>
						</div>
					))}
				</div>
			</>
		</div>
	);
};

export default Conversations;

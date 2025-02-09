import { fetchMessages } from "@/utils/api/messagesApi";
import { useEffect, useState } from "react";
import styles from "./Messages.module.scss";
import LabelHeader from "../LabelHeader/LabelHeader";
import { Copy } from "react-feather";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import { supabase } from "@/lib/supabaseClient";

interface Message {
	id: number;
	user_id: string;
	conversation_id: string;
	format: string;
	transcript: string;
	content: string;
	created_at: string;
	file_name: string;
}

interface MessagesProps {
	conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ conversationId }) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [copied, setCopied] = useState<boolean>(false);

	useEffect(() => {
		const loadMessages = async () => {
			try {
				const data = await fetchMessages(conversationId);
				setMessages(data);
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
				}
			}
		};

		loadMessages();

		// Subscribe to real-time message updates
		const channel = supabase
			.channel(`conversation_messages:${conversationId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				(payload) => {
					setMessages((prev) => [...prev, payload.new as Message]);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [conversationId]);

	const handleCopyToClipboard = async (
		text: string | null
	): Promise<void> => {
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);

		try {
			if (text) {
				// Convert Markdown to HTML

				const html = await marked(text);

				// Use the Clipboard API to copy HTML directly
				await navigator.clipboard.write([
					new ClipboardItem({
						"text/html": new Blob([html], { type: "text/html" }),
						"text/plain": new Blob([text], {
							type: "text/plain",
						}),
					}),
				]);
			}
		} catch (err) {
			console.error("Failed to copy text: ", err);
			alert("Failed to copy text. Please try again.");
		}
	};

	const formatTitleCase = (input: string): string => {
		return input
			.split("-") // Split by hyphen
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
			.join(" "); // Join words with a space
	};

	const formatReadableDate = (isoString: string): string => {
		const date = new Date(isoString);

		// Format date part (e.g., "January 29, 2025")
		const formattedDate = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		// Format time part (e.g., "03:48:10 PM")
		const formattedTime = date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});

		return `${formattedDate} ${formattedTime}`;
	};

	return (
		<div className={styles["message-container"]}>
			{messages?.map((message) => (
				<div key={message.id} className={styles["message"]}>
					<LabelHeader
						label={`${formatTitleCase(message.format)} - ${
							message.file_name
						}`}
						actions={[
							{
								icon: <Copy size={18} />,
								onClick:
									typeof message.content === "string" &&
									message.content
										? () =>
												handleCopyToClipboard(
													message.content
												)
										: () => {},
								label: copied ? "Copied!" : undefined,
							},
							// {
							// 	icon: <RefreshCw size={18} />,
							// 	onClick: () => {},
							// },
						]}
					/>
					<div className={styles["date"]}>
						{formatReadableDate(message.created_at)}
					</div>
					<div className={styles["markdown"]}>
						{typeof message.content === "string" ? (
							<ReactMarkdown>{message.content}</ReactMarkdown>
						) : (
							<p>Invalid content format</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default Messages;

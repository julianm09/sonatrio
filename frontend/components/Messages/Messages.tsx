"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Messages.module.scss";
import LabelHeader from "../LabelHeader/LabelHeader";
import { Copy } from "react-feather";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import { supabase } from "@/lib/supabase";
import { fetchMessages } from "@/utils/api/messagesApi";
import { useMessageContext } from "@/context/MessageContext";

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

const Messages: React.FC = () => {
	const { currentConversation: conversationId } = useMessageContext();
	const [messages, setMessages] = useState<Message[]>([]);
	const [copied, setCopied] = useState<boolean>(false);
	const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

	useEffect(() => {
		let active = true;

		const loadAndSubscribe = async () => {
			// Clean up previous channel first
			if (channelRef.current) {
				await supabase.removeChannel(channelRef.current);
				channelRef.current = null;
			}

			if (!conversationId || !active) return;

			// Fetch existing messages
			try {
				const data = await fetchMessages(conversationId);
				if (!active) return;
				setMessages(data);
			} catch (err) {
				console.error("Failed to fetch messages:", err);
			}

			// Set up real-time subscription
			const channel = supabase.channel(`messages-${conversationId}`).on(
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
			);

			channel.subscribe((status) => {
				console.log("Message subscription status:", status);
			});

			channelRef.current = channel;
		};

		loadAndSubscribe();

		return () => {
			active = false;
			if (channelRef.current) {
				supabase.removeChannel(channelRef.current);
				channelRef.current = null;
			}
		};
	}, [conversationId]);

	const handleCopyToClipboard = async (
		text: string | null
	): Promise<void> => {
		setCopied(true);
		setTimeout(() => setCopied(false), 1000);

		try {
			if (text) {
				const html = await marked(text);
				await navigator.clipboard.write([
					new ClipboardItem({
						"text/html": new Blob([html], { type: "text/html" }),
						"text/plain": new Blob([text], { type: "text/plain" }),
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
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const formatReadableDate = (isoString: string): string => {
		const date = new Date(isoString);
		const formattedDate = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		const formattedTime = date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
		return `${formattedDate} ${formattedTime}`;
	};

	if (!conversationId) {
		return (
			<div className={styles["message-container"]}>
				No session selected.
			</div>
		);
	}

	return (
		<div className={styles["message-container"]}>
			{messages.map((message) => (
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

"use client";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import styles from "./ContentDisplay.module.scss";
import { Copy, RefreshCw } from "react-feather";
import LabelHeader from "../LabelHeader/LabelHeader";

interface Content {
	format: string;
	result: string | null;
}

interface ContentDisplayProps {
	converting: boolean;
	copied: boolean;
	setCopied: React.Dispatch<React.SetStateAction<boolean>>;
	handleConversion: () => Promise<void>;
	content: Record<string, Content>; // Specify the structure of `content`
	errorText: string | null;
}
const ContentDisplay: React.FC<ContentDisplayProps> = ({
	converting,
	copied,
	setCopied,
	handleConversion,
	content,
	errorText,
}) => {
	if (content) {
		console.log(content);
	}

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

	return (
		<>
			<div className={styles["output-container"]}>
				<div className={styles["output"]}>
					{!converting && !errorText ? (
						<>
							{Object.entries(
								content as Record<
									string,
									{ format: string; result: string | null }
								>
							).map(([key, value]) => (
								<div
									key={key}
									className={styles["content-container"]}
								>
									<LabelHeader
										label={value.format}
										actions={[
											{
												icon: <Copy size={18} />,
												onClick:
													typeof value.result ===
														"string" && value.result
														? () =>
																handleCopyToClipboard(
																	value.result
																)
														: () => {},
												label: copied
													? "Copied to clipboard!"
													: undefined,
											},
											{
												icon: <RefreshCw size={18} />,
												onClick: handleConversion,
											},
										]}
									/>

									{/* Ensure the value is a string before rendering */}
									{typeof value.result === "string" ? (
										<ReactMarkdown>
											{value.result}
										</ReactMarkdown>
									) : (
										<p>Invalid content format</p>
									)}
								</div>
							))}
						</>
					) : converting ? (
						<div className={styles["placeholder"]}>
							Hang on! We&apos;re processing your file. This might
							take a few moments depending on the file size...{" "}
							<span className={styles["loader"]}></span>
						</div>
					) : errorText ? (
						<div className={styles["error"]}>{errorText}</div>
					) : (
						<div className={styles["placeholder"]}>
							Please choose a file to get started!
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ContentDisplay;

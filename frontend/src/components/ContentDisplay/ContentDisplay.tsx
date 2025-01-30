"use client";
import styles from "./ContentDisplay.module.scss";
import { useMessageContext } from "@/context/MessageContext";
import Messages from "../Messages/Messages";
import Intro from "../Intro/Intro";

interface ContentDisplayProps {
	converting: boolean;
	errorText: string | null;
}
const ContentDisplay: React.FC<ContentDisplayProps> = ({
	converting,
	errorText,
}) => {
	const { currentConversation } = useMessageContext();

	return (
		<>
			<div className={styles["output-container"]}>
				<div className={styles["scroll-button"]} />
				<div className={styles["output"]}>
					{currentConversation && !errorText && (
						<Messages conversationId={currentConversation} />
					)}

					{!currentConversation && !converting && <Intro />}

					{converting && (
						<div className={styles["placeholder"]}>
							Hang on! We&apos;re processing your file. This might
							take a few moments depending on the file size...{" "}
							<span className={styles["loader"]}></span>
						</div>
					)}

					{errorText && (
						<div className={styles["error"]}>{errorText}</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ContentDisplay;

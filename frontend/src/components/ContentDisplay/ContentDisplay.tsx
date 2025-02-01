"use client";
import styles from "./ContentDisplay.module.scss";
import { useMessageContext } from "@/context/MessageContext";
import Messages from "../Messages/Messages";
import Intro from "../Intro/Intro";
import { X } from "react-feather";

interface ContentDisplayProps {
	converting: boolean;
	errorText: string | null;
	setErrorText: React.Dispatch<React.SetStateAction<string | null>>;
}
const ContentDisplay: React.FC<ContentDisplayProps> = ({
	converting,
	errorText,
	setErrorText,
}) => {
	const { currentConversation } = useMessageContext();

	return (
		<>
			<div className={styles["output-container"]}>
				{errorText && (
					<div
						className={styles["error"]}
						onClick={() => setErrorText(null)}
					>
						{errorText}
						<div className={styles["close"]}>
							<X size={16} />
						</div>
					</div>
				)}
				<div className={styles["scroll-button"]} />
				<div className={styles["output"]}>
					{currentConversation && (
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
				</div>
			</div>
		</>
	);
};

export default ContentDisplay;

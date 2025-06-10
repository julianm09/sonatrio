import { useState } from "react";
import { Info, X } from "react-feather";
import styles from "./KeywordInput.module.scss"; // Import SCSS module

interface KeywordInputProps {
	contentSettings: {
		tone: string;
		audience: string;
		keywords: string[];
	};
	setContentSettings: React.Dispatch<
		React.SetStateAction<{
			tone: string;
			audience: string;
			keywords: string[];
		}>
	>;
}

const KeywordInput: React.FC<KeywordInputProps> = ({
	contentSettings,
	setContentSettings,
}) => {
	const [inputValue, setInputValue] = useState("");

	const addKeyword = () => {
		const trimmed = inputValue.trim();
		if (trimmed && !contentSettings.keywords.includes(trimmed)) {
			setContentSettings((prev) => ({
				...prev,
				keywords: [...prev.keywords, trimmed],
			}));
		}
		setInputValue("");
	};

	const removeKeyword = (word: string) => {
		setContentSettings((prev) => ({
			...prev,
			keywords: prev.keywords.filter((kw) => kw !== word),
		}));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addKeyword();
		}
	};

	return (
		<div className={styles["keyword-container"]}>
			<div className={styles["label"]}>
				Keywords{" "}
				<div className={styles["tip-icon"]}>
					<Info size={16} />

					<div className={styles["tip"]}>
						If your content includes a brand name, use it as the
						first keyword to ensure correct spelling.
					</div>
				</div>
			</div>
			<input
				type="text"
				className={styles["input"]}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type a keyword and press Enter"
			/>

			<div className={styles["keyword-list"]}>
				{contentSettings.keywords.map((word, index) => (
					<div key={index} className={styles["keyword"]}>
						{word}
						<button
							onClick={() => removeKeyword(word)}
							className={styles["delete-button"]}
						>
							<X size={14} />
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default KeywordInput;

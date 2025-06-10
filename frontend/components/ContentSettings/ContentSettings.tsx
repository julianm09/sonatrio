"use client";
import { X } from "react-feather";
import styles from "./ContentSettings.module.scss";
import React from "react";
import LabelHeader from "../LabelHeader/LabelHeader";
import Dropdown from "../Dropdown/Dropdown";
import KeywordInput from "../KeywordInput/KeywordInput";

interface ContentSettingsProps {
	handleToggleSettings: () => void;
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

const ContentSettings: React.FC<ContentSettingsProps> = ({
	handleToggleSettings,
	contentSettings,
	setContentSettings,
}) => {
	// Tone
	const toneOptions = [
		{ value: "original-source", label: "Original Source" },
		{ value: "professional", label: "Professional" },
		{ value: "friendly", label: "Friendly" },
		{ value: "informative", label: "Informative" },
	];

	//Audience
	const audienceOptions = [
		{ value: "beginners", label: "Beginners" },
		{ value: "experts", label: "Experts" },
		{ value: "general-public", label: "General Public" },
	];

	const handleContentSettingsChange = (
		key: "tone" | "audience",
		value: string
	) => {
		setContentSettings((prevSettings) => ({
			...prevSettings,
			[key]: value,
		}));
	};

	const handleResetAllSettings = () => {
		setContentSettings({
			tone: "",
			audience: "",
			keywords: [],
		});
	};

	return (
		<div className={styles["container"]}>
			<div
				className={styles["background"]}
				onClick={handleToggleSettings}
			></div>
			<div className={styles["modal"]}>
				<div className={styles["close"]} onClick={handleToggleSettings}>
					<X size={16} />
				</div>
				<LabelHeader
					label="Content Settings"
					actions={[
						{
							icon: <>reset all</>,
							onClick: handleResetAllSettings,
						},
					]}
					white
				/>

				<div className={styles["settings-container"]}>
					<div className={styles["dropdown-container"]}>
						<div className={styles["label"]}>Tone</div>
						<Dropdown
							options={toneOptions}
							value={contentSettings.tone}
							onChange={(e) => {
								handleContentSettingsChange(
									"tone",
									e.target.value
								);
							}}
							placeholder="Choose a tone"
						/>
					</div>

					<div className={styles["dropdown-container"]}>
						<div className={styles["label"]}>Audience</div>
						<Dropdown
							options={audienceOptions}
							value={contentSettings.audience}
							onChange={(e) => {
								handleContentSettingsChange(
									"audience",
									e.target.value
								);
							}}
							placeholder="Choose an audience"
						/>
					</div>

					<div className={styles["dropdown-container"]}>
						<KeywordInput
							contentSettings={contentSettings}
							setContentSettings={setContentSettings}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContentSettings;

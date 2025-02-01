"use client";
import { ArrowUp, Paperclip, Settings } from "react-feather";
import styles from "./ContentInput.module.scss";
import React, { ChangeEvent } from "react";
import ActionButton from "../ActionButton/ActionButton";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import { useUserContext } from "@/context/UserContext";

interface ContentInputProps {
	file: File | null;
	setFile: React.Dispatch<React.SetStateAction<File | null>>;
	isDragging: boolean;
	setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
	converting: boolean;
	transcript: string | null;
	handleConversion: () => Promise<void>;
	handleToggleSettings: () => void;
	selectedFormats: string[];
	setSelectedFormats: React.Dispatch<React.SetStateAction<string[]>>;
}

type Option = {
	value: string;
	label: string;
};

const options: Option[] = [
	{ value: "instagram-post", label: "Instagram Post" },
	{ value: "linkedin-post", label: "LinkedIn Post" },
	{ value: "blog-post", label: "Blog Post" },
	{ value: "ad-copy", label: "Ad Copy" },
	{ value: "summary", label: "Summary" },
	{ value: "website-copy", label: "Website Copy" },
	{ value: "transcript", label: "Transcript" },
];

const ContentInput: React.FC<ContentInputProps> = ({
	file,
	setFile,
	isDragging,
	setIsDragging,
	converting,
	handleConversion,
	handleToggleSettings,
	selectedFormats,
	setSelectedFormats,
}) => {
	const { user } = useUserContext();

	const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFile(e.dataTransfer.files[0]);
			e.dataTransfer.clearData();
		}
	};

	return (
		<div className={styles["container"]}>
			<div
				className={styles["input-container"]}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className={styles["settings"]}>
					<Settings size={18} onClick={handleToggleSettings} />
				</div>

				<input
					type="file"
					onChange={handleFileInput}
					style={{ display: "none" }}
					id="file-input"
				></input>

				<label
					className={styles["file-input"]}
					htmlFor="file-input"
					style={{
						border: isDragging
							? "1px dashed #AC93FF"
							: "1px dashed #f3f3f370",
						backgroundColor: isDragging ? "#34323A" : "#333",
					}}
				>
					{file ? (
						<p>{file.name}</p>
					) : (
						<>
							<p>Drop a file here, or click to select one.</p>
							<div className={styles["icon"]}>
								<Paperclip size={18} />
							</div>
						</>
					)}
				</label>

				<MultiSelectDropdown
					options={options}
					selectedFormats={selectedFormats}
					setSelectedFormats={setSelectedFormats}
					converting={converting}
				/>

				<ActionButton
					onClick={handleConversion}
					disabled={
						converting ||
						!user ||
						!file ||
						selectedFormats.length === 0
					}
					label={
						converting ? (
							<span className={styles["loader"]}></span>
						) : (
							<ArrowUp size={18} />
						)
					}
				/>
			</div>
		</div>
	);
};

export default ContentInput;

"use client";
import { useEffect, useState } from "react";
import styles from "./FileConverter.module.scss";
import ContentDisplay from "../ContentDisplay/ContentDisplay";
import ContentInput from "../ContentInput/ContentInput";
import axios from "axios";
import { generateContent } from "@/utils/api/contentApi";
import ContentSettings from "../ContentSettings/ContentSettings";

interface ContentValue {
	format: string;
	result: string;
}

type Content = Record<string, ContentValue>;

const FileConverter: React.FC = ({}) => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [transcript, setTranscript] = useState<string | null>(null);
	const [converting, setConverting] = useState(false);
	const [copied, setCopied] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
	const [content, setContent] = useState<Content>({});
	const [errorText, setErrorText] = useState<string | null>(null);

	const handleToggleSettings = () => {
		setOpenSettings(!openSettings);
	};

	const [contentSettings, setContentSettings] = useState({
		tone: "",
		audience: "",
	});

	// Reset transcription when new file is selected
	useEffect(() => {
		setTranscript(null);
	}, [file]);

	// Transcribe file and generate content
	// If transcription exists skip transcription
	const handleConversion = async () => {
		if ((!file && !transcript) || selectedFormats.length === 0) {
			alert(
				"Please provide either a file or a transcript and select an output format."
			);
			return;
		}

		const formData = new FormData();

		if (transcript) {
			formData.append("transcript", transcript);
		} else if (file) {
			formData.append("file", file);
		}

		formData.append("formats", JSON.stringify(selectedFormats));
		formData.append("tone", contentSettings.tone);
		formData.append("audience", contentSettings.audience);

		setConverting(true);
        setErrorText(null)

		try {
			const response = await generateContent(formData);

			setContent(response.content);

			if (response.transcript) {
				setTranscript(response.transcript);
			}
		} catch (error) {
			console.error("Error during conversion:", error);

			if (axios.isAxiosError(error)) {
				setErrorText(
					error.response?.data?.message ||
						"An error occurred during content conversion."
				);
			} else {
				setErrorText("An unexpected error occurred.");
			}
		}

		setConverting(false);
	};

	return (
		<div className={styles["container"]}>
			{openSettings && (
				<ContentSettings
					handleToggleSettings={handleToggleSettings}
					contentSettings={contentSettings}
					setContentSettings={setContentSettings}
				/>
			)}

			<ContentInput
				file={file}
				setFile={setFile}
				isDragging={isDragging}
				setIsDragging={setIsDragging}
				converting={converting}
				transcript={transcript}
				handleConversion={handleConversion}
				handleToggleSettings={handleToggleSettings}
				selectedFormats={selectedFormats}
				setSelectedFormats={setSelectedFormats}
			/>

			<ContentDisplay
				converting={converting}
				setCopied={setCopied}
				copied={copied}
				handleConversion={handleConversion}
				content={content}
                errorText={errorText}
			/>
		</div>
	);
};

export default FileConverter;

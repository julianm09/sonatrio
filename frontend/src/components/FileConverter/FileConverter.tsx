"use client";
import { useEffect, useState } from "react";
import styles from "./FileConverter.module.scss";
import ContentDisplay from "../ContentDisplay/ContentDisplay";
import ContentInput from "../ContentInput/ContentInput";
import axios from "axios";
import { generateContent } from "@/utils/api/contentApi";
import ContentSettings from "../ContentSettings/ContentSettings";
import { useMessageContext } from "@/context/MessageContext";

const FileConverter: React.FC = ({}) => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [transcript, setTranscript] = useState<string | null>(null);
	const [converting, setConverting] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
	const [errorText, setErrorText] = useState<string | null>(null);

	const { currentConversation, setCurrentConversation } = useMessageContext();

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

		if (transcript && file) {
			formData.append("transcript", transcript);
			formData.append("file", file);
		} else if (!transcript && file) {
			formData.append("file", file);
		}

		formData.append("formats", JSON.stringify(selectedFormats));
		formData.append("tone", contentSettings.tone);
		formData.append("audience", contentSettings.audience);

		if (currentConversation) {
			formData.append("conversation_id", currentConversation);
		}

		setConverting(true);
		setErrorText(null);

		try {
			const response = await generateContent(formData);

			setCurrentConversation(response.conversationId);

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

			<ContentDisplay converting={converting} errorText={errorText} />
		</div>
	);
};

export default FileConverter;

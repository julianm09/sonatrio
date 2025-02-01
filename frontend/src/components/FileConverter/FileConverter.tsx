"use client";
import { useEffect, useState } from "react";
import styles from "./FileConverter.module.scss";
import ContentDisplay from "../ContentDisplay/ContentDisplay";
import ContentInput from "../ContentInput/ContentInput";
import { generateContent } from "@/utils/api/contentApi";
import ContentSettings from "../ContentSettings/ContentSettings";
import { useMessageContext } from "@/context/MessageContext";
import { useUserContext } from "@/context/UserContext";

const FileConverter: React.FC = ({}) => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [transcript, setTranscript] = useState<string | null>(null);
	const [converting, setConverting] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
	const [errorText, setErrorText] = useState<string | null>(null);

	const { currentConversation, setCurrentConversation } = useMessageContext();

	const { user } = useUserContext();

	const handleToggleSettings = () => {
		setOpenSettings(!openSettings);
	};

	const [contentSettings, setContentSettings] = useState({
		tone: "",
		audience: "",
		keywords: [] as string[],
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

		if (user) {
			formData.append("user", user.id);
		}

		formData.append("formats", JSON.stringify(selectedFormats));
		formData.append("tone", contentSettings.tone);
		formData.append("audience", contentSettings.audience);
		formData.append("keywords", JSON.stringify(contentSettings.keywords));

		if (currentConversation) {
			formData.append("conversation_id", currentConversation);
		}

		setConverting(true);
		setErrorText(null); // Reset error state before request

		// ✅ Call API and handle error response properly
		const response = await generateContent(formData);

		if (response.error) {
			setErrorText(response.error); // ✅ Set error from API response
			setConverting(false);
			return;
		}

		// ✅ Success: Process response
		setCurrentConversation(response.conversationId);

		if (response.transcript) {
			setTranscript(response.transcript);
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

			<ContentDisplay
				converting={converting}
				errorText={errorText}
				setErrorText={setErrorText}
			/>

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
		</div>
	);
};

export default FileConverter;

"use client";
import { useEffect, useState } from "react";
import styles from "./FileConverter.module.scss";
import ContentDisplay from "../ContentDisplay/ContentDisplay";
import ContentInput from "../ContentInput/ContentInput";
import axios from "axios";
import { generateContent } from "@/utils/api/contentApi";
import ContentSettings from "../ContentSettings/ContentSettings";

const FileConverter: React.FC = ({}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [outputText, setOutputText] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState("");
    const [converting, setConverting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

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
        if ((!file && !transcript) || !selectedFormat) {
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

        formData.append("format", selectedFormat);
        formData.append("tone", contentSettings.tone);
        formData.append("audience", contentSettings.audience);

        setConverting(true);

        try {
            const response = await generateContent(formData);

            console.log(response);

            setOutputText(response.content || "Conversion successful!");
            if (response.transcript) {
                setTranscript(response.transcript);
            }
        } catch (error) {
            console.error("Error during conversion:", error);

            if (axios.isAxiosError(error)) {
                setOutputText(
                    error.response?.data?.message ||
                        "An error occurred during content conversion."
                );
            } else {
                setOutputText("An unexpected error occurred.");
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
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                file={file}
                setFile={setFile}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                converting={converting}
                transcript={transcript}
                handleConversion={handleConversion}
                handleToggleSettings={handleToggleSettings}
            />

            <ContentDisplay
                outputText={outputText}
                converting={converting}
                setCopied={setCopied}
                copied={copied}
            />
        </div>
    );
};

export default FileConverter;

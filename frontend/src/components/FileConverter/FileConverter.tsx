"use client";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { useState, ChangeEvent } from "react";
import styles from "./FileConverter.module.scss";

const FileConverter: React.FC = ({}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [outputText, setOutputText] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState("");
    const [converting, setConverting] = useState(false);

    const handleFormat = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFormat(event.target.value);
    };

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

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const uploadFile = async () => {
        if (!file || !selectedFormat) {
            alert("Please select a file and an output format.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", selectedFormat);

        setConverting(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/transcribe",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response);

            setOutputText(response.data.content || "Conversion successful!");
        } catch (error) {
            console.error("Error uploading file:", error);

            // Handle the 'unknown' type of error
            if (axios.isAxiosError(error)) {
                setOutputText(
                    error.response?.data?.message ||
                        "An error occurred during file conversion."
                );
            } else {
                setOutputText("An unexpected error occurred.");
            }
        }

        setConverting(false);
    };

    return (
        <div className={styles["container"]}>
            <div className={styles["container-label"]}>
                Convert Your Audio or Video File
            </div>
            <div
                className={styles["input-container"]}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
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
                        <p>Drop your video here, or click to select one.</p>
                    )}
                </label>

                <select
                    className={styles["convert-select"]}
                    value={selectedFormat}
                    onChange={handleFormat}
                >
                    <option value="" disabled>
                        Choose an output format:
                    </option>
                    <option value="blog-post">Blog Post</option>
                    <option value="linkedin-post">LinkedIn Post</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="study-guide">Study Guide</option>
                    <option value="transcript">Transcript</option>
                </select>

                <button
                    className={styles["convert-button"]}
                    onClick={uploadFile}
                >
                    {converting ? "Converting..." : "Convert file"}
                </button>
            </div>

            <div className={styles["container-label"]}>Output</div>
            <div className={styles["output-container"]}>
                {outputText ? (
                    <ReactMarkdown>{outputText}</ReactMarkdown>
                ) : converting ? (
                    <div className={styles["placeholder"]}>
                        Hang on! We&apos;re processing your file...
                    </div>
                ) : (
                    <div className={styles["placeholder"]}>
                        Please choose a file to get started!
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileConverter;

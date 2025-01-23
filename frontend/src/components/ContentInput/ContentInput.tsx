"use client";
import { Settings } from "react-feather";
import styles from "./ContentInput.module.scss";
import React, { ChangeEvent } from "react";

interface ContentInputProps {
    selectedFormat: string;
    setSelectedFormat: React.Dispatch<React.SetStateAction<string>>;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    isDragging: boolean;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    converting: boolean;
    transcript: string | null;
    handleConversion: () => Promise<void>;
}

const ContentInput: React.FC<ContentInputProps> = ({
    selectedFormat,
    setSelectedFormat,
    file,
    setFile,
    isDragging,
    setIsDragging,
    converting,
    transcript,

    handleConversion,
}) => {
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

    return (
        <>
            <div className={styles["container-label"]}>
                <div className={styles["label"]}>
                    Convert Your Audio or Video File
                </div>{" "}
                <div className={styles["actions"]}>
                    <div className={styles["save"]}>
                        <Settings size={18} />
                    </div>
                </div>
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
                    <option value="ad-copy">Ad Copy</option>
                    <option value="instagram-post">Instagram Post</option>
                    <option value="facebook-post">Facebook Post</option>
                    <option value="tiktok-script">Tiktok Script</option>
                    <option value="youtube-script">Youtube Script</option>
                    <option value="linkedin-post">LinkedIn Post</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="study-guide">Study Guide</option>
                    <option value="transcript">Transcript</option>
                </select>

                <button
                    className={styles["convert-button"]}
                    onClick={handleConversion}
                >
                    {converting
                        ? "Generating Content..."
                        : transcript
                        ? "Regenerate Content"
                        : "Generate Content"}
                </button>
            </div>
        </>
    );
};

export default ContentInput;

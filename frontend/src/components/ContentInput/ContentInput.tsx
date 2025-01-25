"use client";
import { Settings } from "react-feather";
import styles from "./ContentInput.module.scss";
import React, { ChangeEvent } from "react";
import LabelHeader from "../LabelHeader/LabelHeader";
import Dropdown from "../Dropdown/Dropdown";
import ActionButton from "../ActionButton/ActionButton";

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
    handleToggleSettings: () => void;
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
    handleToggleSettings,
}) => {
    const options = [
        { value: "blog-post", label: "Blog Post" },
        { value: "ad-copy", label: "Ad Copy" },
        { value: "instagram-post", label: "Instagram Post" },
        { value: "facebook-post", label: "Facebook Post" },
        { value: "tiktok-script", label: "Tiktok Script" },
        { value: "youtube-script", label: "Youtube Script" },
        { value: "linkedin-post", label: "LinkedIn Post" },
        { value: "tutorial", label: "Tutorial" },
        { value: "study-guide", label: "Study Guide" },
        { value: "transcript", label: "Transcript" },
        { value: "summary", label: "Summary" },
        { value: "website-copy", label: "Website Copy" },
    ];

    const handleFormatChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
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
            <LabelHeader
                label="Convert Your Audio or Video File"
                actions={[
                    {
                        icon: <Settings size={18} />,
                        onClick: handleToggleSettings,
                    },
                ]}
            />
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

                <Dropdown
                    options={options}
                    value={selectedFormat}
                    onChange={handleFormatChange}
                    placeholder="Choose an output format"
                />

                <ActionButton
                    onClick={handleConversion}
                    disabled={converting}
                    label={
                        converting ? (
                            <>Generating Content...</>
                        ) : transcript ? (
                            "Regenerate Content"
                        ) : (
                            "Generate Content"
                        )
                    }
                />
            </div>
        </>
    );
};

export default ContentInput;

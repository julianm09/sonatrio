"use client";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import styles from "./ContentDisplay.module.scss";
import { Copy, Save } from "react-feather";
import LabelHeader from "../LabelHeader/LabelHeader";

interface ContentDisplayProps {
    outputText: string | null;
    converting: boolean;
    copied: boolean;
    setCopied: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
    outputText,
    converting,
    copied,
    setCopied,
}) => {
    const handleCopyToClipboard = async (): Promise<void> => {
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);

        try {
            if (outputText) {
                // Convert Markdown to HTML
                const html = await marked(outputText);

                // Use the Clipboard API to copy HTML directly
                await navigator.clipboard.write([
                    new ClipboardItem({
                        "text/html": new Blob([html], { type: "text/html" }),
                        "text/plain": new Blob([outputText], {
                            type: "text/plain",
                        }),
                    }),
                ]);
            }
        } catch (err) {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy text. Please try again.");
        }
    };

    const handleSave = () => {
        return;
    };

    return (
        <>
            <LabelHeader
                label="Output"
                actions={[
                    {
                        icon: <Copy size={18} />,
                        onClick: outputText ? handleCopyToClipboard : () => {},
                        label: copied ? "Copied to clipboard!" : undefined,
                    },
                    {
                        icon: <Save size={18} />,
                        onClick: handleSave, // Add your save function
                    },
                ]}
            />

            <div className={styles["output-container"]}>
                {!converting && outputText ? (
                    <ReactMarkdown>{outputText}</ReactMarkdown>
                ) : converting ? (
                    <div className={styles["placeholder"]}>
                        Hang on! We&apos;re processing your file. This might
                        take a few moments depending on the file size... <span className={styles["loader"]}></span>
                    </div>
                ) : (
                    <div className={styles["placeholder"]}>
                        Please choose a file to get started!
                    </div>
                )}
            </div>
        </>
    );
};

export default ContentDisplay;

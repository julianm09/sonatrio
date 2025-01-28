"use client";
import styles from "./ContentLabelHeader.module.scss";
import React, { JSX } from "react";

interface ContentLabelHeaderProps {
    label: string; // The main label text
    actions?: {
        icon: JSX.Element; // The action icon to render
        onClick: () => void; // The action's click handler
        label?: string; // Optional label for the action (e.g., "Copied to clipboard!")
    }[];
}

const ContentLabelHeader: React.FC<ContentLabelHeaderProps> = ({ label, actions }) => {
    return (
        <div className={styles["container-label"]}>
            <div className={styles["label"]}>{label}</div>
            <div className={styles["actions"]}>
                {actions?.map((action, index) => (
                    <div
                        key={index}
                        className={styles["action"]}
                        onClick={action.onClick}
                    >
                        <div>{action.label || action.icon}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentLabelHeader;

"use client";
import styles from "./LabelHeader.module.scss";
import React, { JSX } from "react";

interface LabelHeaderProps {
	label: string; // The main label text
	actions?: {
		icon: JSX.Element; // The action icon to render
		onClick: () => void; // The action's click handler
		label?: string; // Optional label for the action (e.g., "Copied to clipboard!")
	}[];
	white?: boolean;
}

const LabelHeader: React.FC<LabelHeaderProps> = ({
	label,
	actions,
	white = true,
}) => {
	return (
		<div className={styles["container-label"]}>
			<div className={`${styles["label"]} ${white && styles["white"]}`}>
				{label}
			</div>
			<div className={styles["actions"]}>
				{actions?.map((action, index) => (
					<div
						key={index}
						className={styles["action"]}
						onClick={action.onClick}
					>
						{action.label || action.icon}
					</div>
				))}
			</div>
		</div>
	);
};

export default LabelHeader;

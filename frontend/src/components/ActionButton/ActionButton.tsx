// components/ActionButton.tsx
import React from "react";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
    label: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = ({
    label,
    onClick,
    disabled = false,
    type = "button",
}) => {
    return (
        <button
            type={type}
            className={`${styles["convert-button"]} ${
                disabled && styles["inactive"]
            }`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default ActionButton;

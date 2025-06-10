// components/TextInput.tsx
import React, { useState } from "react";
import styles from "./TextInput.module.scss";
import { Eye, EyeOff } from "react-feather";

interface TextInputProps {
    label?: string;
    type?: "text" | "email" | "password"; // Supported types
    name: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    type = "text",
    name,
    value,
    placeholder = "",
    onChange,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleToggleVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const isPasswordType = type === "password";

    return (
        <div className={styles["input-container"]}>
            {label && <label htmlFor={name}>{label}</label>}

            <input
                type={isPasswordType && isPasswordVisible ? "text" : type}
                name={name}
                id={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="input-field"
            />
            {isPasswordType && (
                <button
                    type="button"
                    onClick={handleToggleVisibility}
                    className={styles["toggle-visibility-button"]}
                    aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                    }
                >
                    {isPasswordVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            )}
        </div>
    );
};

export default TextInput;

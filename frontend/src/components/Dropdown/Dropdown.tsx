import React from "react";
import styles from "./Dropdown.module.scss"

interface DropdownProps {
    options: { value: string; label: string }[]; // Array of option objects with value and label
    value: string; // Currently selected value
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Change handler
    placeholder?: string; // Optional placeholder text for the default option
    className?: string; // Optional class for styling
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option"
}) => {
    return (
        <select className={styles["dropdown"]} value={value} onChange={onChange}>
            <option value="" disabled>
                {placeholder}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;

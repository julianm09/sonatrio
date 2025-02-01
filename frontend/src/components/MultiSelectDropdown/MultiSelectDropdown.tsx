// File: components/MultiSelectDropdown.tsx
import React, { useEffect, useState } from "react";
import styles from "./MultiSelectDropdown.module.scss";
import { ChevronDown, ChevronUp } from "react-feather";

type Option = {
	value: string;
	label: string;
};

type MultiSelectDropdownProps = {
	options: Option[];
	selectedFormats: string[];
	setSelectedFormats: React.Dispatch<React.SetStateAction<string[]>>;
	converting: boolean;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
	selectedFormats,
	setSelectedFormats,
	options,
	converting,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleOptionClick = (value: string) => {
		const updatedSelection = selectedFormats.includes(value)
			? selectedFormats.filter((option) => option !== value)
			: [...selectedFormats, value];

		setSelectedFormats(updatedSelection);
	};

	useEffect(() => {
		if (converting) {
			setIsOpen(false);
		}
	}, [converting]);

	return (
		<div className={styles["dropdown"]}>
			<div className={styles["header"]} onClick={toggleDropdown}>
				<span>
					{selectedFormats.length > 0
						? `${selectedFormats.length} selected`
						: "Format"}
				</span>
				<div className={styles["caret"]}>
					{isOpen ? (
						<ChevronUp size={18} />
					) : (
						<ChevronDown size={18} />
					)}
				</div>
			</div>
			{isOpen && (
				<div className={styles["menu"]}>
					{options.map((option) => (
						<div
							key={option.value}
							className={`${styles["option"]} ${
								selectedFormats.includes(option.value)
									? styles["selected"]
									: ""
							}`}
							onClick={() => handleOptionClick(option.value)}
						>
							<input
								type="checkbox"
								checked={selectedFormats.includes(option.value)}
								readOnly
							/>
							<span>{option.label}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MultiSelectDropdown;

"use client"

import React, { useState } from "react";
import styles from "./SideNavbar.module.scss";
import { User, LogIn, Sidebar, LogOut, Edit, DollarSign } from "react-feather";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import Conversations from "../Conversations/Conversations";
import { useMessageContext } from "@/context/MessageContext";

const SideNavbar: React.FC = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleNavbar = () => setIsCollapsed(!isCollapsed);

	const { user, userId, logout } = useUserContext();
	const { setCurrentConversation } = useMessageContext();

	const handleNewConversation = () => {
		setCurrentConversation(null);
	};

	return (
		<div className={styles["container"]}>
			<div
				className={`${styles["collapse-button"]} ${
					isCollapsed ? styles["hidden"] : ""
				}`}
				onClick={toggleNavbar}
				style={{ cursor: "pointer" }}
			>
				<Sidebar size={18} />
			</div>

			<div
				className={`${styles["sidebar"]} ${
					isCollapsed ? styles.collapsed : ""
				}`}
			>
				<div className={styles["navList"]}>
					<div
						className={styles["navItem"]}
						onClick={toggleNavbar}
						style={{ cursor: "pointer" }}
					>
						<Sidebar size={18} />
					</div>
					<div
						className={styles["navItem"]}
						onClick={handleNewConversation}
						style={{ cursor: "pointer" }}
					>
						<Edit size={18} />
						{!isCollapsed && <span>New Session</span>}
					</div>

					{user ? (
						<div
							className={styles["navItem"]}
							onClick={logout}
							style={{ cursor: "pointer" }}
						>
							<LogOut size={18} />
							{!isCollapsed && <span>Sign Out</span>}
						</div>
					) : (
						<Link
							className={styles["navItem"]}
							href="/signin"
							style={{ cursor: "pointer" }}
						>
							<LogIn size={18} />
							{!isCollapsed && <span>Sign In</span>}
						</Link>
					)}
				</div>
				{user && (
					<Conversations
						userId={userId && userId}
						isCollapsed={isCollapsed}
					/>
				)}
			</div>
		</div>
	);
};

export default SideNavbar;

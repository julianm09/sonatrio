"use client";
import FileConverter from "@/components/FileConverter/FileConverter";
import styles from "./page.module.css";
import SideNavbar from "@/components/SideNavbar/SideNavbar";

export default function Home() {
	return (
		<div className={styles["page"]}>
			<SideNavbar />
			<FileConverter />
		</div>
	);
}

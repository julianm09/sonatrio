"use client";
import FileConverter from "@/components/FileConverter/FileConverter";
import styles from "./page.module.css";
import { useUserContext } from "@/context/UserContext";
import SideNavbar from "@/components/SideNavbar/SideNavbar";

export default function Home() {
    const { user } = useUserContext();
    console.log("user:", user);

    return (
        <div className={styles["page"]}>
            <SideNavbar/>
            <FileConverter/>
        </div>
    );
}

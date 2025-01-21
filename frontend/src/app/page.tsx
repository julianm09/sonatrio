"use client";
import FileConverter from "@/components/FileConverter/FileConverter";
import styles from "./page.module.css";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
    const { user } = useAppContext();
    console.log(user)

    return (
        <div className={styles["page"]}>
            <Navbar/>
            <FileConverter/>
        </div>
    );
}

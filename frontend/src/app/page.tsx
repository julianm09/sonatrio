"use client";
import styles from "./page.module.css";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
    const { user } = useAppContext();
    console.log(user)

    return (
        <div className={styles.page}>

        </div>
    );
}

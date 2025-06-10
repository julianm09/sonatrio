import Image from "next/image";
import styles from "./page.module.css";
import SideNavbar from "@/components/SideNavbar/SideNavbar";
import FileConverter from "@/components/FileConverter/FileConverter";

export default function Home() {
  return (
    <div className={styles.page}>
			<SideNavbar />
      <FileConverter />
    </div>
  );
}

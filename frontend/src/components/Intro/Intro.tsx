import Link from "next/link";
import styles from "./Intro.module.scss";

const Intro: React.FC = ({}) => {
	return (
		<div className={styles["container"]}>
			<h1 className={styles["headline"]}>
				Welcome to <span className={styles["highlight"]}>Sonatrio</span> | AI-Powered Content from Your Audio & Video
			</h1>
			<p className={styles["subheader"]}>
				Upload your file and let AI transform it into blog
				posts, social media content, summaries, and more!
			</p>
			<Link href="/login" className={styles["cta"]}>
				Sign in to get started
			</Link>
		</div>
	);
};

export default Intro;

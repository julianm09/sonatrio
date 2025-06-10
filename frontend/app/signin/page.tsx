"use client";

import styles from "./page.module.scss";
import LoginForm from "@/components/LoginForm/LoginForm";

export default function SigninPage() {
	return (
		<div className={styles["container"]}>
			<LoginForm />
		</div>
	);
}

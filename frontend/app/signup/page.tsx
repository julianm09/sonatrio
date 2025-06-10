import SignupForm from "@/components/SignupForm/SignupForm";
import styles from "./page.module.scss";

export default function SignupPage() {
	return (
		<div className={styles["container"]}>
			<SignupForm />
		</div>
	);
}

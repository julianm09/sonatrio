import SignupForm from "@/components/SignupForm/SignupForm";
import styles from "./page.module.scss";

const SignupPage: React.FC = () => {
    return (
        <div className={styles["container"]}>
            <SignupForm />
        </div>
    );
};

export default SignupPage;

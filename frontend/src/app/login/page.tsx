import styles from "./page.module.scss";

import LoginForm from "@/components/LoginForm/LoginForm";

const LoginPage: React.FC = () => {
    return (
        <div className={styles["container"]}>
            <LoginForm />
        </div>
    );
};

export default LoginPage;

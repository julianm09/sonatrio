"use client";
import { useState } from "react";
import styles from "./page.module.scss"

import LoginForm from "@/components/LoginForm/LoginForm";

const LoginPage: React.FC = () => {
    const [loginData, setLoginData] = useState({
        name: "",
        email: "",
        password: "",
    });

    return (
        <div className={styles["container"]}>
            <LoginForm formData={loginData} setFormData={setLoginData} />
        </div>
    );
};

export default LoginPage;

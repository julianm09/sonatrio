"use client";
import { useState } from "react";

import LoginForm from "@/components/LoginForm/LoginForm";

const LoginPage: React.FC = () => {
    const [loginData, setLoginData] = useState({
        name: "",
        email: "",
        password: "",
    });

    return (
        <>
            <LoginForm formData={loginData} setFormData={setLoginData} />
        </>
    );
};

export default LoginPage;

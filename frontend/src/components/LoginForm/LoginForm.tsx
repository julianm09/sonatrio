"use client";
import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { loginUser } from "@/utils/api/userApi";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import TextInput from "../TextInput/TextInput";
import LabelHeader from "../LabelHeader/LabelHeader";
import SubmitButton from "../SubmitButton/SubmitButton";

const LoginForm: React.FC = ({}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);

    const { user, setUser, logout } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Call the loginUser function with the provided formData
            const result = await loginUser(formData);

            // Clear any previous error (if applicable)
            setError(null);

            // Update the user and token in context
            setUser(result.user);

            // Persist user profile and token to localStorage
            localStorage.setItem("user", JSON.stringify(result.user));

            // Optionally redirect or perform other actions after login
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Handle Axios errors specifically
                const errorMessage =
                    err.response?.data?.message ||
                    "An unexpected error occurred";
                setError(errorMessage);
                console.error("Axios Error:", errorMessage);
            } else if (err instanceof Error) {
                // Handle generic errors
                setError(err.message);
                console.error("Generic Error:", err.message);
            } else {
                // Handle unexpected errors
                setError("An unexpected error occurred");
                console.error("Unknown Error:", err);
            }

            // Optional: Logout user if an error occurs during login
            logout();
        }
    };

    return (
        <div className={styles["container"]}>
            <LabelHeader label="Log In" />
            <form className={styles["form"]} onSubmit={handleLoginSubmit}>
                <TextInput
                    label="Email"
                    type="text"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                />

                <TextInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                />

                <SubmitButton label={"Log In"} type="submit" />
            </form>

            <a className={styles["login-switch"]} href="/signup">
                Need an account? Sign up
            </a>
            <div className={styles["error-message"]}>{error}</div>
        </div>
    );
};

export default LoginForm;

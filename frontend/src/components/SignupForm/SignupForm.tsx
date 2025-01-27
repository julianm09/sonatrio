"use client";
import { useState, useEffect } from "react";
import styles from "./SignupForm.module.scss";
import { registerUser } from "@/utils/api/userApi";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import TextInput from "../TextInput/TextInput";
import LabelHeader from "../LabelHeader/LabelHeader";
import SubmitButton from "../SubmitButton/SubmitButton";

const SignupForm: React.FC = ({}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { user } = useAppContext();

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

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await registerUser(formData);
            console.log("User created:", result);
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Handle Axios error with a response
                const errorMessage =
                    err.response?.data?.message ||
                    "An unexpected error occurred";
                setError(errorMessage);
                console.log("Axios Error:", errorMessage);
            } else if (err instanceof Error) {
                // Handle generic errors
                setError(err.message);
                console.log("Generic Error:", err.message);
            } else {
                setError("An unexpected error occurred");
                console.log("Unknown Error:", err);
            }
        }
    };

    return (
        <div className={styles["container"]}>
            <LabelHeader label="Sign Up" />
            <form className={styles["form"]} onSubmit={handleRegisterSubmit}>
                <TextInput
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Name"
                    onChange={handleInputChange}
                />

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

                <TextInput
                    label="Verify Password"
                    type="password"
                    name="verify-password"
                    value={verifyPassword}
                    placeholder="Password"
                    onChange={(e) => {
                        setVerifyPassword(e.target.value);
                    }}
                />

                <SubmitButton label={"Sign Up"} type="submit" />
            </form>

            <a className={styles["login-switch"]} href="/login">
                Have an account? Login
            </a>
            <div className={styles["error-message"]}>{error}</div>
        </div>
    );
};

export default SignupForm;

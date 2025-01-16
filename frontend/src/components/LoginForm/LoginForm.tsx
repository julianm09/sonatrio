"use client";
import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { loginUser, registerUser } from "@/utils/api/userApi";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = ({}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [login, setLogin] = useState(true);
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { user, setUser } = useAppContext();
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

    const handleLoginSwitch = () => {
        setLogin(!login);
        setError(null);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await loginUser(formData);
            console.log("Login successful:", result);
            setError(null);
            setUser(result.user.profile);
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
            {login ? (
                <>
                    <form
                        className={styles["form"]}
                        onSubmit={handleLoginSubmit}
                    >
                        <h2>Login</h2>
                        <div className={styles["input-container"]}>
                            <label>email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles["input-container"]}>
                            <label>password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button
                            className={styles["login-button"]}
                            type="submit"
                        >
                            Log In
                        </button>
                    </form>
                </>
            ) : (
                <form
                    className={styles["form"]}
                    onSubmit={handleRegisterSubmit}
                >
                    <h2>Sign Up</h2>
                    <div className={styles["input-container"]}>
                        <label>name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles["input-container"]}>
                        <label>email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles["input-container"]}>
                        <label>password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles["input-container"]}>
                        <label>verify password</label>
                        <input
                            type="password"
                            name="verify-password"
                            placeholder="verify password"
                            value={verifyPassword}
                            onChange={(e) => {
                                setVerifyPassword(e.target.value);
                            }}
                        />
                    </div>
                    <button className={styles["login-button"]} type="submit">
                        Sign Up
                    </button>
                </form>
            )}
            <div className={styles["login-switch"]} onClick={handleLoginSwitch}>
                {login ? "Need an account? Sign up" : "Have an account? Login"}
            </div>
            <div className={styles["error-message"]}>{error}</div>
        </div>
    );
};

export default LoginForm;

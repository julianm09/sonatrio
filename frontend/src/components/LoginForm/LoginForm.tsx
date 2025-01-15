import { useState } from "react";
import styles from "./LoginForm.module.scss";
import { loginUser, registerUser } from "@/utils/api/userApi";

interface LoginData {
    name: string;
    email: string;
    password: string;
}

interface LoginFormProps {
    formData: LoginData;
    setFormData: React.Dispatch<React.SetStateAction<LoginData>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, setFormData }) => {
    const [login, setLogin] = useState(true);
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLoginLink = () => {
        setLogin(!login);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await loginUser(formData);
            console.log("Login successful:", result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await registerUser(formData);
            console.log("User created:", result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
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

                        <button type="submit">Log In</button>

                        <div
                            className={styles["login-link"]}
                            onClick={handleLoginLink}
                        >
                            Create an account
                        </div>
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
                    <button type="submit">Sign Up</button>

                    <div
                        className={styles["login-link"]}
                        onClick={handleLoginLink}
                    >
                        Have an account? Login
                    </div>
                </form>
            )}
            {error}
        </div>
    );
};

export default LoginForm;

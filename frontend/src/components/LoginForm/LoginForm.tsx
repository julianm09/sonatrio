"use client";
import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { useRouter } from "next/navigation";
import TextInput from "../TextInput/TextInput";
import LabelHeader from "../LabelHeader/LabelHeader";
import SubmitButton from "../SubmitButton/SubmitButton";
import { supabase } from "@/lib/supabaseClient";
import { useUserContext } from "@/context/UserContext";

const LoginForm: React.FC = ({}) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "julianmayes@gmail.com",
		password: "Okayseeyou2020!",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	const { user, setUser } = useUserContext();

	useEffect(() => {
		console.log(user);
		if (user) {
			router.push("/"); // Redirect to home page if signed in
		}
	}, [user, router]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const email = formData.email;
			const password = formData.password;

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw new Error(error.message); // Convert to a generic Error

			console.log("User data:", data);

			setUser(data.user); // Set the user from the response
		} catch (err: unknown) {
			// Use 'unknown' to catch any type of error
			if (err instanceof Error) {
				setError(err.message); // Handle known Error types
			} else {
				setError("An unexpected error occurred"); // Handle unknown errors
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles["container"]}>
			<LabelHeader label="Log In" />
			<form className={styles["form"]} onSubmit={handleLogin}>
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
			{loading && "loading..."}
		</div>
	);
};

export default LoginForm;

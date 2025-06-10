"use client";

import { useState, useEffect } from "react";
import styles from "./LoginForm.module.scss";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUserContext } from "@/context/UserContext";
import TextInput from "../TextInput/TextInput";
import LabelHeader from "../LabelHeader/LabelHeader";
import SubmitButton from "../SubmitButton/SubmitButton";

const LoginForm: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { user, setUser } = useUserContext();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/"); // Redirect to home page if signed in
		}
	}, [user, router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password,
				});

			if (signInError) {
				setError(signInError.message);
				return;
			}

			console.log("Signed in!", data);
			setUser(data?.user);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
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
					type="email"
					name="email"
					value={email}
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextInput
					label="Password"
					type="password"
					name="password"
					value={password}
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<SubmitButton label="Log In" type="submit" />
			</form>

			<a className={styles["login-switch"]} href="/signup">
				Need an account? Sign up
			</a>
			{error && <div className={styles["error-message"]}>{error}</div>}
			{loading && "loading..."}
		</div>
	);
};

export default LoginForm;

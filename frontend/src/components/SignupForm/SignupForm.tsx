"use client";

import { useState, useEffect } from "react";
import styles from "./SignupForm.module.scss";
import { supabase } from "@/lib/supabaseClient"; // Import your Supabase client
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import TextInput from "../TextInput/TextInput";
import LabelHeader from "../LabelHeader/LabelHeader";
import SubmitButton from "../SubmitButton/SubmitButton";

const SignupForm: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [verifyPassword, setVerifyPassword] = useState("Okayseeyou2020!");
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const { user } = useUserContext();
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

		// Reset previous messages
		setError(null);
		setSuccessMessage(null);

		// Validate password match
		if (formData.password !== verifyPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			// Sign up the user
			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					data: {
						name: formData.name, // Store additional user metadata
					},
				},
			});

			if (error) {
				throw new Error(error.message);
			}

			const user = data.user;
			if (!user) {
				throw new Error(
					"User registration successful but no user data returned."
				);
			}

			// Create profile in the profiles table
			const { error: profileError } = await supabase
				.from("users") // Replace with your table name
				.insert([
					{
						user_id: user.id, // User ID from Supabase
						email: formData.email,
						name: formData.name,
						tier: "free", // Default user tier
						created_at: new Date().toISOString(),
					},
				]);

			if (profileError) {
				throw new Error(
					`Profile creation failed: ${profileError.message}`
				);
			}

			// Success message
			setSuccessMessage("Account created! Check your email to confirm.");
			setError(null);
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
			{successMessage && (
				<div className={styles["success-message"]}>
					{successMessage}
				</div>
			)}
			{error && <div className={styles["error-message"]}>{error}</div>}
		</div>
	);
};

export default SignupForm;

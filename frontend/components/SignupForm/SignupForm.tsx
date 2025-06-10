"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./SignupForm.module.scss";
import TextInput from "../TextInput/TextInput";
import LabelHeader from "../LabelHeader/LabelHeader";
import SubmitButton from "../SubmitButton/SubmitButton";

const SignupForm: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [verifyPassword, setVerifyPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);

		if (formData.password !== verifyPassword) {
			setError("Passwords do not match");
			return;
		}

		const { data, error: signUpError } = await supabase.auth.signUp({
			email: formData.email,
			password: formData.password,
		});

		if (signUpError) {
			setError(signUpError.message);
			return;
		}

		if (data.user) {
			const { error: insertError } = await supabase.from("users").insert({
				auth_user_id: data.user.id,
				email: formData.email,
				name: formData.name,
			});

			if (insertError) {
				setError("Sign-up succeeded, but failed to save user info.");
				console.error(insertError);
			} else {
				setSuccessMessage(
					"Account created! Check your email to confirm."
				);
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
					type="email"
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
					onChange={(e) => setVerifyPassword(e.target.value)}
				/>
				<SubmitButton label="Sign Up" type="submit" />
			</form>
			<a className={styles["login-switch"]} href="/signin">
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

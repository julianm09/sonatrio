import { Request, Response } from "express";
import { supabase } from "../utils/supabase";

/**
 * Create a new user with Supabase Authentication and store user data in Supabase database.
 * @param req - Express request object
 * @param res - Express response object
 */
export const createUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { name, email, password } = req.body;

	// Validate input
	if (!email || !password) {
		res.status(400).json({ message: "Email and password are required." });
		return;
	}

	try {
		// Create user with Supabase Authentication
		const { data: authData, error: authError } = await supabase.auth.signUp(
			{
				email,
				password,
			}
		);

		if (authError) {
			res.status(400).json({
				message: "User creation failed.",
				error: authError.message,
			});
			return;
		}

		// Extract the user ID
		const { user } = await authData;

		if (!user) {
			res.status(500).json({
				message: "User creation succeeded, but user data is missing.",
			});
			return;
		}

		if (!user.id || !user.email) {
			console.error("Invalid user data:", {
				id: user.id,
				email: user.email,
			});
			res.status(400).json({ message: "Invalid user data." });
			return;
		}

		console.log(user.id, user.email, name);

		// Save user information in Supabase database
		const { error: dbError } = await supabase.from("users").insert([
			{
				user_id: user.id,
				email: user.email,
				username: name || null,
				account_type: "free",
			},
		]);

		if (dbError) {
			res.status(500).json({
				message: "Failed to save user in the database.",
				error: dbError.message,
			});
			return;
		}

		// Respond with user details
		res.status(201).json({
			message: "User created successfully!",
			user: {
				id: user.id,
				email: user.email,
				username: name || null,
			},
		});
	} catch (error: unknown) {
		// Handle unexpected errors
		res.status(500).json({
			message: "An unexpected error occurred.",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Login a user with email and password, and fetch profile from Supabase database.
 * Ensures email verification before allowing access.
 * @param req - Express request object
 * @param res - Express response object
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	// Validate input
	if (!email || !password) {
		res.status(400).json({ message: "Email and password are required." });
		return;
	}

	try {
		// Authenticate user with Supabase Auth
		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError) {
			res.status(401).json({
				message: "Login failed. Please check your email and password.",
				error: authError.message,
			});
			return;
		}

		const { user } = authData;

		if (!user) {
			res.status(500).json({
				message: "Login succeeded, but user data is missing.",
			});
			return;
		}

		// Ensure email is verified
		if (!user.email_confirmed_at) {
			res.status(403).json({
				message:
					"Email not verified. Please verify your email before logging in.",
			});
			return;
		}

		// Fetch user profile from Supabase database
		const { data: userProfile, error: profileError } = await supabase
			.from("users")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (profileError || !userProfile) {
			res.status(404).json({
				message: "User profile not found.",
				error: profileError?.message,
			});
			return;
		}

		// Respond with user details and profile
		res.status(200).json({
			message: "Login successful!",
			user: {
				id: user.id,
				email: user.email,
				username: userProfile.username,
				account_type: userProfile.account_type,
			},
		});
	} catch (error: unknown) {
		// Handle unexpected errors
		res.status(500).json({
			message: "An unexpected error occurred.",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

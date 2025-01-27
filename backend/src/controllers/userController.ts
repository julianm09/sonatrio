import { Request, Response } from "express";
import pool from "../utils/db";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";

/**
 * Create a new user with Firebase Authentication and store user data in PostgreSQL.
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
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Update Firebase user's profile with display name
        if (name) {
            await updateProfile(user, { displayName: name });
        }

        // Send email verification
        await sendEmailVerification(user);
        console.log("Verification email sent.");

        // Save user information in PostgreSQL
        const firebaseUID = user.uid;
        const query = `
            INSERT INTO users (firebase_uid, email, display_name, account_type)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [firebaseUID, email, name || null, "free"];
        const result = await pool.query(query, values);

        console.log("User saved in PostgreSQL:", result.rows[0]);

        // Respond with user details
        res.status(201).json({
            message: "User created successfully!",
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
        });
    } catch (error: unknown) {
        // Handle Firebase-specific errors
        if (error instanceof FirebaseError) {
            res.status(400).json({
                message: "User creation failed.",
                errorCode: error.code,
                errorMessage: error.message,
            });
        } else {
            // Handle unexpected errors
            res.status(500).json({
                message: "An unexpected error occurred.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
};

/**
 * Login a user with email and password, and fetch profile from PostgreSQL.
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
        // Authenticate user with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
            res.status(403).json({
                message:
                    "Email not verified. Please verify your email before logging in.",
            });
            return;
        }

        // Get Firebase ID Token
        const idToken = await user.getIdToken();

        // Fetch user profile from PostgreSQL
        const query = "SELECT * FROM users WHERE firebase_uid = $1";
        const values = [user.uid];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User profile not found." });
            return;
        }

        const userProfile = result.rows[0];

        // Respond with user details and profile
        res.status(200).json({
            message: "Login successful!",
            token: idToken, // Firebase ID token
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                profile: userProfile, // Include profile details from PostgreSQL
            },
        });
    } catch (error: unknown) {
        // Handle Firebase-specific errors
        if (error instanceof FirebaseError) {
            res.status(401).json({
                message:
                    "Login failed. Please check that your email and password are correct.",
                errorCode: error.code,
                errorMessage: error.message,
            });
        } else {
            // Handle unexpected errors
            res.status(500).json({
                message: "An unexpected error occurred.",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
};

import { Request, Response } from "express";
import pool from "../utils/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generateVerificationToken = (userId: number): string | null => {
    try {
        return jwt.sign(
            { userId },
            process.env.VERIFICATION_TOKEN_SECRET as string, // Secret key
            { expiresIn: "1h" } // Token valid for 1 hour
        );
    } catch (error) {
        console.error("Error generating verification token:", error);
        return null; // Return null if token generation fails
    }
};

const sendVerificationEmail = async (
    email: string,
    token: string
): Promise<boolean> => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Use your email provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email Address",
            html: `<p>Click the link below to verify your email address:</p>
                <a href="${verificationLink}">${verificationLink}</a>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to:", email);
        return true; // Indicate success
    } catch (error) {
        const err = error as Error; // Type assertion
        console.error("Error sending verification email:", err.message);
        return false;
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { token } = req.body;

    if (!token) {
        res.status(400).json({ error: "Verification token is required" });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.VERIFICATION_TOKEN_SECRET as string
        ) as jwt.JwtPayload;

        const userId = decoded.userId;

        const query = `
            UPDATE users SET verified = TRUE WHERE id = $1 RETURNING id;
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            res.status(400).json({ error: "Invalid token or user not found" });
            return;
        }

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const query = `
            INSERT INTO users (name, email, password_hash, verified)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `;
        const values = [name, email, hashedPassword, false];
        const result = await pool.query(query, values);

        const userId = result.rows[0].id;

        // Generate verification token
        const verificationToken = generateVerificationToken(userId);
        if (!verificationToken) {
            res.status(500).json({
                error: "Failed to generate verification token",
            });
            return;
        }

        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationToken);
        if (!emailSent) {
            res.status(500).json({
                error: "Failed to send verification email",
            });
            return;
        }

        res.status(201).json({
            message: "User created successfully. Please verify your email.",
            token: verificationToken,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginUser: (req: Request, res: Response) => Promise<void> = async (
    req,
    res
) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    try {
        // Fetch user by email
        const query = `
            SELECT id, name, email, password_hash, role, verified 
            FROM users WHERE email = $1
        `;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const user = result.rows[0];

        // Check if user is verified
        if (!user.verified) {
            res.status(403).json({
                error: "Account is not verified. Please verify your email before logging in.",
            });
            return;
        }

        // Compare password with hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET as string, // Use a strong secret stored in your environment variables
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Send response
        res.status(200).json({
            message: "Login successful",
            token, // Include the JWT token
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

import { Request, Response } from "express";
import pool from "../utils/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createUser: (
    req: Request,
    res: Response
) => Promise<void> = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).send({ error: "All fields are required" });
        return; // Ensure the function exits after sending a response
    }

    const role = "user";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        // Insert user into the database
        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4);
        `;

        const values = [name, email, hashedPassword, role];

        await pool.query(query, values);

        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        if (err instanceof Error) {
            // Handle duplicate email error
            if (err.message.includes("unique constraint")) {
                res.status(409).json({ error: "Email already exists" });
            } else {
                console.error("Error creating user:", err.message);
                res.status(500).json({ error: "Internal server error" });
            }
        } else {
            console.error("Unknown error:", err);
            res.status(500).json({ error: "An unexpected error occurred" });
        }
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
        const query =
            "SELECT id, name, email, password_hash, role FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const user = result.rows[0];

        // Compare password with hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // Send response
        res.status(200).json({
            message: "Login successful",
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

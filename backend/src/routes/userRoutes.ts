import { Router } from "express";
import { createUser, loginUser, verifyEmail } from "../controllers/userController";

const router = Router();

// Register a new user
router.post("/users/register", createUser);

// Login a user
router.post("/users/login", loginUser);

// Verify a user
router.post("/users/verify-email", verifyEmail);

export default router;

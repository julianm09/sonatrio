import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";

const router = Router();

// Register a new user
router.post("/users/register", createUser);

// Login a user
router.post("/users/login", loginUser);

export default router;

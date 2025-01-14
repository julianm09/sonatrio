import { Request, Response, Router } from "express";
import { createUser, getAllUsers, loginUser } from "../controllers/userController";

const router = Router();

router.get("/users", getAllUsers);

// Register a new user
router.post("/users/register", createUser);

// Login a user
router.post("/users/login", loginUser);

export default router;

import { Request, Response } from "express";
import { getUsers, createUser } from "../services/userService";
import { User } from "../models/userModel";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password }: User = req.body;
  try {
    const newUser = await createUser({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
};

import { Request, Response } from "express";
import { getUsersService, updateUserService, deleteUserService, createUserService, loginUserService } from "./user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup
export const createUser = async (req: Request, res: Response) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !phone || !role || !password) {
    return res.status(400).json({ success: false, message: "All fields are required: name, email, phone, role, password" });
  }

  const user = await createUserService({ name, email, phone, role, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};




// Signin
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await loginUserService(email);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret_key", { expiresIn: "1d" });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } },
  });
};



// all users (Admin)
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getUsersService();
  res.status(200).json({ success: true, message: "Users retrieved successfully", data: users });
};




// update user Admin or customer
export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = req.body;
  const requester = (req as any).user;

  if (requester.role !== "admin" && requester.id !== id) {
    return res.status(403).json({ success: false, message: "Forbidden: cannot update this user" });
  }

  const updated = await updateUserService(id, body);
  res.status(200).json({ success: true, message: "User updated successfully", data: updated });
};




// Delete user Admin 
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteUserService(id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
};

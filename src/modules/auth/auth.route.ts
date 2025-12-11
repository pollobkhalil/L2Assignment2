import express from "express";
import { createUser, loginUser } from "../user/user.controller";

const router = express.Router();

// SIGNUP
router.post("/signup", createUser);

// SIGNIN
router.post("/signin", loginUser);

export { router as authRoute };

import express from "express";
import { deleteUser, getAllUsers, updateUser } from "./user.controller";
import { adminMiddleware, authMiddleware } from "../../middleware/auth.middleware";


const router = express.Router();




// Users  routes

router.get("/", authMiddleware, adminMiddleware, getAllUsers); 
router.put("/:id", authMiddleware, updateUser);                
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser); 

export { router as userRoute };

import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from "./vehicle.controller";

import { authMiddleware, adminMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

// Public
router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);

// Admin only
router.post("/", authMiddleware, adminMiddleware, createVehicle);
router.put("/:id", authMiddleware, adminMiddleware, updateVehicle);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVehicle);

export { router as vehicleRoute };

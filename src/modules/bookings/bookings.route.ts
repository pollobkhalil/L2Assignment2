import express from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
} from "./bookings.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();


router.post("/", authMiddleware, createBooking);


router.get("/", authMiddleware, getBookings);


router.put("/:id", authMiddleware, updateBooking);

export { router as bookingsRoute };

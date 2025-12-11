import { Request, Response } from "express";
import {
  createBookingService,
  getBookingsService,
  updateBookingService,
} from "./bookings.service";




// Create booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    const userId = req.user.id; 

    const booking = await createBookingService(
      userId,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};





// Get bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.id;
    const role = req.user.role;

    const bookings = await getBookingsService(userId, role);

    res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};






// Update booking
export const updateBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const bookingId = Number(req.params.id);
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const updatedBooking = await updateBookingService(
      bookingId,
      status,
      userId,
      role
    );

    res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: updatedBooking,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

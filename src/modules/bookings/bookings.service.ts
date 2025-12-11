import { pool } from "../../database/db";

// Create booking
export const createBookingService = async (
  userId: number,
  vehicleId: number,
  rentStartDate: string,
  rentEndDate: string
) => {


  // Check vehicle exists
  const vehicleRes = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [vehicleId]
  );
  const vehicle = vehicleRes.rows[0];
  if (!vehicle) throw new Error("Vehicle not found");

  //  Check vehicle available

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  //  Calculate price
  const start = new Date(rentStartDate);
  const end = new Date(rentEndDate);

  if (end <= start) throw new Error("End date must be after start date");

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const totalPrice = diffDays * vehicle.daily_rent_price;

  // booking
  const bookingRes = await pool.query(
    `INSERT INTO bookings
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [userId, vehicleId, rentStartDate, rentEndDate, totalPrice]
  );

  //  Update vehicle status 
  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked', updated_at = NOW() WHERE id = $1",
    [vehicleId]
  );

  const booking = bookingRes.rows[0];
  booking.vehicle = {
    vehicle_name: vehicle.vehicle_name,
    daily_rent_price: vehicle.daily_rent_price,
  };

  return booking;
};

// Get bookings
export const getBookingsService = async (userId: number, role: string) => {
  if (role === "admin") {
   
    const res = await pool.query(
      `SELECT b.*, u.name as customer_name, u.email as customer_email, 
              v.vehicle_name, v.registration_number
       FROM bookings b
       JOIN users u ON b.customer_id = u.id
       JOIN vehicles v ON b.vehicle_id = v.id`
    );
    return res.rows;
  } else {


    // Customer bookings
    const res = await pool.query(
      `SELECT b.*, v.vehicle_name, v.registration_number, v.type
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.customer_id = $1`,
      [userId]
    );
    return res.rows;
  }
};

// Update booking
export const updateBookingService = async (
  bookingId: number,
  status: string,
  userId: number,
  role: string
) => {

  // current booking
  const res = await pool.query("SELECT * FROM bookings WHERE id = $1", [
    bookingId,
  ]);
  const booking = res.rows[0];
  if (!booking) throw new Error("Booking not found");


  // Customer cancel before start date
  if (role === "customer") {
    if (booking.customer_id !== userId)
      throw new Error("You can only update your own booking");
    if (status !== "cancelled")
      throw new Error("Customer can only cancel the booking");
    const today = new Date();
    const startDate = new Date(booking.rent_start_date);
    if (today >= startDate) throw new Error("Cannot cancel after start date");
  }


  // Admin  returned
  if (role === "admin" && status === "returned") {
    await pool.query(
      "UPDATE vehicles SET availability_status = 'available', updated_at = NOW() WHERE id = $1",
      [booking.vehicle_id]
    );
  }

  // Update status
  const updateRes = await pool.query(
    `UPDATE bookings SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, bookingId]
  );

  const updatedBooking = updateRes.rows[0];

  if (status === "returned") {
    updatedBooking.vehicle = { availability_status: "available" };
  }

  return updatedBooking;
};

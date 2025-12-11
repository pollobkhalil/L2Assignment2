import express, { Request, Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { initDB } from "./database/db";
import { authRoute } from "./modules/auth/auth.route";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { bookingsRoute } from "./modules/bookings/bookings.route";
import path from "path";

const app = express();

app.use(express.json());

// Initialize DB
initDB();

// Default route (must be BEFORE app.listen)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Vehicle Rental Backend API!",
    path:req.path,
    status: "running",
    available_routes: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      vehicles: "/api/v1/vehicles",
      bookings: "/api/v1/bookings",
    },
  });
});

// API routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingsRoute);

// Server run
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

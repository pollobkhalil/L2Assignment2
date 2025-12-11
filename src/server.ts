import express, { Request, Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { initDB } from "./database/db";
import { authRoute } from "./modules/auth/auth.route";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { bookingsRoute } from "./modules/bookings/bookings.route";

const app = express()

app.use(express.json());

initDB();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingsRoute);


app.listen(5000, () => {

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            message: "Welcome to the Vehicle Rental Backend API!",
            status: "running",
            available_routes: {
                auth: "/api/v1/auth",
                users: "/api/v1/users",
                vehicles: "/api/v1/vehicles",
                bookings: "/api/v1/bookings"
            }
        })
    })

    console.log("Server is running on port 5000");

})


Vehicle Rental System



# Features

User Management
  - Register new users (Signup)
  - Login with JWT authentication (Signin)
  - Admin can view, update, and delete users
  - Customers can update their own profile
  - 
Vehicle Management
  - Admin can add, update, or delete vehicles
  - View all vehicles or specific vehicle details
  - Track vehicle availability status

Booking Management
  - Customers can create bookings
  - Admin can manage all bookings
  - Automatic price calculation
  - Booking status updates (active, cancelled, returned)

Authentication & Authorization
  - Role-based access control (Admin / Customer)
  - Passwords hashed with bcrypt
  - JWT-based token authentication


# Technology Stack

- Node.js & TypeScript
- Express.js
- PostgreSQL (Neon DB)
- bcryptjs
- jsonwebtoken (JWT)
- Vercel (Deployment)


# Setup & Usage

1. Clone the repository
git clone https://github.com/yourusername/vehicle-rental-system.git
cd vehicle-rental-system
2. Install dependencies
bash
Copy code
npm install
3. Create .env file
ini
Copy code
DATABASE_URL=your_neon_db_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
4. Run the server 
bash
Copy code
npm run dev
Server will start at: http://localhost:5000

5. API Endpoints
Auth
POST /api/v1/auth/signup – Register new user

POST /api/v1/auth/signin – Login user

Users
GET /api/v1/users – Admin only: Get all users

PUT /api/v1/users/:userId – Admin or own profile: Update user

DELETE /api/v1/users/:userId – Admin only: Delete user (if no active bookings)

Vehicles
POST /api/v1/vehicles – Admin only: Add vehicle

GET /api/v1/vehicles – Get all vehicles

GET /api/v1/vehicles/:vehicleId – Get vehicle by ID

PUT /api/v1/vehicles/:vehicleId – Admin only: Update vehicle

DELETE /api/v1/vehicles/:vehicleId – Admin only: Delete vehicle (if no active bookings)



Bookings
POST /api/v1/bookings – Create booking (Customer/Admin)

GET /api/v1/bookings – Role-based view (Admin sees all, Customer sees own)

PUT /api/v1/bookings/:bookingId – Update booking status (cancelled / returned)

6. Deployment
The project can be deployed on Vercel using the provided vercel.json.

Ensure all environment variables are set in Vercel dashboard.

7. Notes
Make sure Neon DB tables are created using initDB() before testing.
All password fields are securely hashed.
Role-based access is enforced using authentication middleware.


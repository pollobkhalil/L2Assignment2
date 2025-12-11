import { Pool } from "pg";

export const pool = new Pool({
  connectionString:
    'postgresql://neondb_owner:npg_nG0eXbR8QhFo@ep-cool-breeze-a8ko8mgj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
});


export const initDB = async () => {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(250) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(50) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Vechicles table
  await pool.query(`
   CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
  availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available','booked')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
  `);

  // Bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id),
      vehicle_id INT NOT NULL REFERENCES vehicles(id),
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price INT NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

};

import { pool } from "../../database/db";

export type VehicleData = {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "available" | "booked";
};

// Create
export const createVehicleService = async (data: VehicleData) => {
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, COALESCE($5,'available'))
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status;`,
    [data.vehicle_name, data.type, data.registration_number, data.daily_rent_price, data.availability_status]
  );
  return result.rows[0];
};

// Get all
export const getAllVehiclesService = async () => {
  const result = await pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles ORDER BY id`);
  return result.rows;
};

// Get by id
export const getVehicleByIdService = async (id: number) => {
  const result = await pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1`, [id]);
  return result.rows[0];
};

// Update (partial)
export const updateVehicleService = async (id: number, data: Partial<VehicleData>) => {
  const keys = Object.keys(data);
  if (keys.length === 0) throw new Error("No fields to update");

  const fields = keys.map((k, i) => `${k} = $${i + 1}`);
  const values = keys.map(k => (data as any)[k]);
  const query = `
    UPDATE vehicles
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${keys.length + 1}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status;
  `;
  values.push(id);
  const result = await pool.query(query, values);
  return result.rows[0];
};




// Delete (only if no active bookings)
export const deleteVehicleService = async (id: number) => {
  // check active bookings
  const active:any = await pool.query(`SELECT 1 FROM bookings WHERE vehicle_id = $1 AND status = 'active' LIMIT 1`, [id]);
  if (active.rowCount > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
};

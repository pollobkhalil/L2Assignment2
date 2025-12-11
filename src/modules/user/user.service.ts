import bcrypt from "bcryptjs";
import { pool } from "../../database/db";





export const createUserService = async (data: {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, phone, role, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [data.name, data.email, data.phone, data.role, hashedPassword]
  );

  return result.rows[0];
};

//  all users
export const getUsersService = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );

  return result.rows;
};

//  user update
export const updateUserService = async (id: number, data: any) => {
  const fields:any = [];
  const values = [];

  Object.keys(data).forEach((key, index) => {
    fields.push(`${key} = $${index + 1}`);
    values.push(data[key]);
  });

  const query = `
    UPDATE users 
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING id, name, email, phone, role;
  `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete user
export const deleteUserService = async (id: number) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};



export const loginUserService = async (email: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  return result.rows[0];
};
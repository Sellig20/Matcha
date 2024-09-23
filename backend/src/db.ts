// import dotenv from 'dotenv';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

console.log("\n ENV VARIABLES \n-> ", process.env.POSTGRES_USER,
  "\n-> ", process.env.POSTGRES_PASSWORD,
  "\n-> ", process.env.POSTGRES_HOST,
  "\n-> ", process.env.POSTGRES_DB);

export const pool = new Pool({
  
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'db',
  database: process.env.POSTGRES_DB,
  port: 5432,
  max: 20, //max 20 clients
  idleTimeoutMillis: 30000, //idle clients max 30 sec
  connectionTimeoutMillis: 2000,
});

export const query = async (text: string, params?: any[]): Promise<any> => {

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    console.log("\n res = ", res);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return (res);
  }
  catch (error) {
    console.error("Error executing query", { text, error });
    throw (error);
  }
};
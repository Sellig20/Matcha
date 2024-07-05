import { Pool } from "pg";
import env from "./utils/validateEnv";

export const pool = new Pool({
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOSTNAME,
  database: env.POSTGRES_NAME,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT,
});

export const query = async (text: string, params?: any[]): Promise<any> => {

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return (res);
  }
  catch (error) {
    console.error("Error executing query", { text, error });
    throw (error);
  }
};

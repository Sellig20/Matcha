// src/db.ts
import dotenv from "dotenv";
import { Pool, QueryResult, QueryResultRow } from "pg";

// Load environment variables from .env file
dotenv.config();

// Configuration for the PostgreSQL connection pool
const poolConfig = {
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.DB_HOST || "db", // Use DB_HOST from .env or default to 'db' for Docker Compose
	database: process.env.POSTGRES_DB,
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
	max: process.env.DB_POOL_MAX_CLIENTS
		? parseInt(process.env.DB_POOL_MAX_CLIENTS, 10)
		: 20, // Max number of clients in the pool
	idleTimeoutMillis: process.env.DB_POOL_IDLE_TIMEOUT
		? parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10)
		: 30000, // How long a client is allowed to remain idle before being closed
	connectionTimeoutMillis: process.env.DB_POOL_CONNECTION_TIMEOUT
		? parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT, 10)
		: 2000, // How long to wait for a client from the pool
};

// Create a new PostgreSQL connection pool
export const pool = new Pool(poolConfig);

// Event listener for new client connections
pool.on("connect", (client) => {
	console.log("[DB Pool]: Client connected to PostgreSQL.");
	// You could set client-specific parameters here if needed, e.g., client.query('SET search_path TO my_schema');
});

// Event listener for errors from idle clients in the pool
pool.on("error", (err, client) => {
	console.error("[DB Pool]: Unexpected error on idle client", {
		error: err.message,
		// clientInfo: client, // Be cautious logging client object, might contain sensitive info
	});
	// Consider a more robust error handling strategy, e.g., attempting to reconnect or exiting if critical
});

/**
 * Executes a SQL query using a client from the connection pool.
 * Includes basic logging for query duration and errors.
 * @param text The SQL query string (e.g., "SELECT * FROM users WHERE id = $1").
 * @param params Optional array of parameters to be sanitized and substituted into the query.
 * @returns A Promise resolving to the QueryResult.
 */
export const query = async <R extends QueryResultRow = any>(
	text: string,
	params?: any[]
): Promise<QueryResult<R>> => {
	const start = Date.now();
	try {
		// Acquire a client from the pool, run the query, and release the client
		const res = await pool.query<R>(text, params);
		const duration = Date.now() - start;
		console.log("[DB Query]: Executed query", {
			text: text.length > 100 ? text.substring(0, 97) + "..." : text, // Log truncated query for brevity
			durationMs: duration,
			rowCount: res.rowCount,
		});
		return res;
	} catch (error: any) {
		// Catching as 'any' to access potential pg error properties
		const duration = Date.now() - start;
		console.error("[DB Query]: Error executing query", {
			text: text.length > 100 ? text.substring(0, 97) + "..." : text, // Log truncated query
			params,
			durationMs: duration,
			errorCode: error.code, // PostgreSQL error code (if available)
			errorMessage: error.message,
		});
		throw error; // Re-throw the error to be handled by the caller
	}
};

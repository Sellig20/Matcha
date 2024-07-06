import app from "./src/app";
import { pool } from "./src/db";
import ORM from "./src/orm/orm";
import { schema } from "./src/orm/schema";
import dotenv from 'dotenv';

dotenv.config();


const port = process.env.BACKEND_PORT;
let orm: ORM | null = null;

function startServer() {
	try {
		console.log("\n\n START SERVER \n\n");
		orm = new ORM(schema);
		if (!orm) {
			throw new Error("Failed to create ORM");
		}
		return app.listen(3000, () => {
			console.log(`[server]: Server is running at http://localhost:${port}`);
		});
	} catch (error) {
		console.error("Failed to start the server:", error);
	}
}

async function stopServer() {
	try {
		server?.close();
		await pool.end();
		console.log("[server]: Server stopped");
	} catch (error) {
		console.error("Failed to stop the server:", error);
	}
}

const server = startServer();

process.on("SIGINT", async () => {
	await stopServer();
});

process.on("SIGTERM", async () => {
	await stopServer();
});

export default orm;


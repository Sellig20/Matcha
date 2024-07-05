import app from "./src/app";
import env from "./src/utils/validateEnv";
import { pool } from "./src/database";
import ORM from "./src/orm/orm";
import { schema } from "./src/orm/schema";

const port = env.EXPRESS_PORT;
let orm: ORM | null = null;

function startServer() {
	try {
		orm = new ORM(schema);
		if (!orm) {
			throw new Error("Failed to create ORM");
		}
		return app.listen(port, () => {
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

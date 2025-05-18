import dotenv from "dotenv";
dotenv.config(); // Load environment variables at the very beginning

import http from "http";
import app from "./src/app"; // Your Express app
import { pool } from "./src/db"; // Your PostgreSQL pool
import { ORM } from "./src/orm/orm"; // Corrected import for ORM class
import { sqlSchema } from "./src/orm/schemaTypes"; // Import the SQL schema definition

// Import Model Classes
import { UserModel } from "./src/models/user.model";
import { TagModel } from "./src/models/tag.model";
import { UserTagModel } from "./src/models/userTag.model";
import { UserPictureModel } from "./src/models/userPicture.model";
import { ProfileViewModel } from "./src/models/profileView.model";
import { LikeModel } from "./src/models/like.model";
import { ConnectionModel } from "./src/models/connection.model";
import { ChatMessageModel } from "./src/models/chatMessage.model";
import { NotificationModel } from "./src/models/notification.model";
import { BlockedUserModel } from "./src/models/blockedUser.model";
import { ReportedUserModel } from "./src/models/reportedUser.model";

// --- Global Variables ---
const DEFAULT_PORT = 3000;
const port = process.env.BACKEND_PORT
	? parseInt(process.env.BACKEND_PORT, 10)
	: DEFAULT_PORT;

// ORM and HTTP Server Instances
let ormInstance: ORM | null = null;
let httpServer: http.Server | null = null;

// Model Instances - to be initialized in startApp
// These are declared here and will be assigned in startApp
// They are then exported for use in other modules.
export let userModel: UserModel | null = null;
export let tagModel: TagModel | null = null;
export let userTagModel: UserTagModel | null = null;
export let userPictureModel: UserPictureModel | null = null;
export let profileViewModel: ProfileViewModel | null = null;
export let likeModel: LikeModel | null = null;
export let connectionModel: ConnectionModel | null = null;
export let chatMessageModel: ChatMessageModel | null = null;
export let notificationModel: NotificationModel | null = null;
export let blockedUserModel: BlockedUserModel | null = null;
export let reportedUserModel: ReportedUserModel | null = null;

/**
 * Initializes the ORM, database schema, models, and starts the HTTP server.
 */
async function startApp() {
	console.log("[Server]: Starting application...");

	try {
		// 1. Initialize ORM
		ormInstance = new ORM(pool, sqlSchema);
		console.log("[Server]: ORM initialized.");

		// 2. Initialize Database Schema
		const forceRecreateDb =
			process.env.NODE_ENV === "development" &&
			process.env.DB_FORCE_RECREATE === "true";
		if (forceRecreateDb) {
			console.warn(
				"[Server]: DB_FORCE_RECREATE is true. Database will be wiped and reinitialized."
			);
		}
		await ormInstance.initializeDatabase(forceRecreateDb);
		console.log("[Server]: Database schema initialized.");

		// 3. Initialize Models
		if (!ormInstance) {
			throw new Error(
				"ORM instance is not available for model initialization."
			);
		}
		userModel = new UserModel(ormInstance);
		tagModel = new TagModel(ormInstance);
		userTagModel = new UserTagModel(ormInstance);
		userPictureModel = new UserPictureModel(ormInstance);
		profileViewModel = new ProfileViewModel(ormInstance);
		likeModel = new LikeModel(ormInstance);
		connectionModel = new ConnectionModel(ormInstance);
		chatMessageModel = new ChatMessageModel(ormInstance);
		notificationModel = new NotificationModel(ormInstance);
		blockedUserModel = new BlockedUserModel(ormInstance);
		reportedUserModel = new ReportedUserModel(ormInstance);
		console.log("[Server]: All models initialized.");

		// 4. Create and start HTTP server
		httpServer = http.createServer(app);

		httpServer.listen(port, () => {
			console.log(`[Server]: Server is running at http://localhost:${port}`);
		});
	} catch (error) {
		console.error("[Server]: Failed to start the application:", error);
		if (pool) {
			await pool
				.end()
				.catch((poolError) =>
					console.error(
						"[Server]: Error closing pool during failed startup:",
						poolError
					)
				);
		}
		process.exit(1); // Exit if critical setup fails
	}
}

/**
 * Gracefully stops the HTTP server and database pool.
 */
async function stopApp() {
	console.log("[Server]: Attempting to stop the server gracefully...");
	try {
		if (httpServer) {
			await new Promise<void>((resolve, reject) => {
				httpServer!.close((err) => {
					if (err) {
						console.error("[Server]: Error closing HTTP server:", err);
						return reject(err);
					}
					console.log("[Server]: HTTP server closed.");
					resolve();
				});
			});
		}

		if (pool) {
			await pool.end();
			console.log("[Server]: Database pool closed.");
		}
		console.log("[Server]: Application stopped successfully.");
	} catch (error) {
		console.error("[Server]: Error during graceful shutdown:", error);
		process.exit(1); // Force exit if cleanup fails
	}
}

// --- Start the Application ---
startApp();

// --- Graceful Shutdown Handling ---
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
	process.on(signal, async () => {
		console.log(`[Server]: Received ${signal}. Initiating shutdown...`);
		await stopApp();
		process.exit(0);
	});
});

// Export the ORM instance (already done in your provided code)
// Note: Model instances are now also exported directly above where they are declared.
export { ormInstance as orm };

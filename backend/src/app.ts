// src/app.ts
import express from "express";
import cors from "cors";
import userController from "./controllers/user.controller"; // Adjust path

const app = express();

app.use(cors()); // Configure CORS as needed
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// Mount the user controller
app.use("/api", userController); // All user routes will be prefixed with /api

// Basic route for testing
app.get("/api/test", (req, res) => {
	res.send("Hello from Matcha Backend!");
});

// Error handling middleware (optional, but good practice)
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error("Unhandled application error:", err.stack || err);
		res.status(err.status || 500).json({
			message: err.message || "Internal Server Error",
			// error: process.env.NODE_ENV === 'development' ? err : {} // Only show error details in dev
		});
	}
);

export default app;

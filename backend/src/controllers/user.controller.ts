// src/controllers/user.controller.ts
import { Request, Response, Router } from "express";
import {
	userModel, // Assuming userModel is exported from your main app setup or a central models index
} from "../../server"; // Adjust this path to where your userModel instance is exported
import { UserInput } from "../orm/schemaTypes"; // For request body type

const router = Router();

// Middleware to check if userModel is initialized (optional, but good for robustness)
router.use((req, res, next) => {
	if (!userModel) {
		return res
			.status(503)
			.json({
				message: "UserModel not initialized. Server may be starting up.",
			});
	}
	next();
});

// --- CRUD Operations for Users ---

// CREATE a new user
router.post("/users", async (req: Request, res: Response) => {
	try {
		// In a real app, you would hash the password here before saving
		// For example: const hashedPassword = await bcrypt.hash(req.body.password, 10);
		// And then pass { ...req.body, password_hash: hashedPassword } to userModel.create
		// Also, req.body should be validated (e.g., using Zod)
		const userData = req.body as UserInput; // Basic type assertion for now

		// Basic validation example (extend with Zod for production)
		if (
			!userData.username ||
			!userData.email ||
			!userData.password_hash ||
			!userData.first_name ||
			!userData.last_name
		) {
			return res
				.status(400)
				.json({
					message:
						"Missing required fields: username, email, password_hash, first_name, last_name",
				});
		}

		const newUser = await userModel!.create(userData); // Use non-null assertion if middleware ensures it's defined
		if (newUser) {
			// Avoid sending password_hash back in the response
			const {
				password_hash,
				email_verification_token,
				password_reset_token,
				...userResponse
			} = newUser;
			res.status(201).json(userResponse);
		} else {
			res.status(500).json({ message: "Failed to create user" });
		}
	} catch (error: any) {
		console.error("Error creating user:", error);
		// Check for unique constraint violation (example for PostgreSQL)
		if (error.code === "23505") {
			// Unique violation
			if (error.detail?.includes("email")) {
				return res.status(409).json({ message: "Email already exists." });
			} else if (error.detail?.includes("username")) {
				return res.status(409).json({ message: "Username already exists." });
			}
		}
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

// READ all users (with basic pagination)
router.get("/users", async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const offset = (page - 1) * limit;

		const users = await userModel!.find({
			limit,
			offset,
			orderBy: { field: "created_at", direction: "DESC" },
		});
		// Avoid sending password_hash back
		const usersResponse = users.map((user) => {
			const {
				password_hash,
				email_verification_token,
				password_reset_token,
				...userRes
			} = user;
			return userRes;
		});
		// TODO: Add total count for proper pagination headers/metadata
		res.status(200).json(usersResponse);
	} catch (error: any) {
		console.error("Error fetching users:", error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

// READ a single user by ID
router.get("/users/:id", async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id, 10);
		if (isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		const user = await userModel!.findById(userId);
		if (user) {
			const {
				password_hash,
				email_verification_token,
				password_reset_token,
				...userResponse
			} = user;
			res.status(200).json(userResponse);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error: any) {
		console.error(`Error fetching user ${req.params.id}:`, error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

// UPDATE a user by ID
router.put("/users/:id", async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id, 10);
		if (isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		// Ensure password_hash is not updated directly via this generic route if present in body.
		// Password updates should have a dedicated, more secure flow.
		const { password_hash, email, username, ...updateData } =
			req.body as Partial<UserInput>;

		// Prevent changing email or username via this generic update to avoid unique constraint issues without proper checks.
		// These should have dedicated routes or more complex logic if allowed.
		if (email || username) {
			return res
				.status(400)
				.json({
					message:
						"Email and username cannot be changed via this endpoint. Use specific routes if available.",
				});
		}

		const updatedUser = await userModel!.update(userId, updateData);
		if (updatedUser) {
			const {
				password_hash: _,
				email_verification_token,
				password_reset_token,
				...userResponse
			} = updatedUser;
			res.status(200).json(userResponse);
		} else {
			// Could be user not found or update failed for other reasons (e.g. no actual changes)
			const userExists = await userModel!.findById(userId);
			if (!userExists) {
				return res.status(404).json({ message: "User not found" });
			}
			res.status(304).json({ message: "User not modified or update failed" }); // Not Modified or other appropriate status
		}
	} catch (error: any) {
		console.error(`Error updating user ${req.params.id}:`, error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

// DELETE a user by ID
router.delete("/users/:id", async (req: Request, res: Response) => {
	try {
		const userId = parseInt(req.params.id, 10);
		if (isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user ID format" });
		}

		const success = await userModel!.delete(userId);
		if (success) {
			res.status(204).send(); // No Content
		} else {
			res
				.status(404)
				.json({ message: "User not found or could not be deleted" });
		}
	} catch (error: any) {
		console.error(`Error deleting user ${req.params.id}:`, error);
		res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
});

export default router;

import { RequestHandler } from "express";
import orm from "../../index";
import createHttpError from "http-errors";
import { UserCreate } from "../orm/schema";

interface signUpBody {
	email: string;
	username: string;
	lastName: string;
	firstName: string;
	password: string;
	gender: string;
	sexualPreferences: string[];
	biography: string;
	interests: string[];
	stated_location: string,
	real_location: string,
}

export const signUp: RequestHandler<
	unknown,
	unknown,
	signUpBody,
	unknown
> = async (req, res, next) => {
	try {
		Object.entries(req.body).forEach(([key, value]) => {
			if (!value) {
				throw createHttpError(400, `User ${key} is required`);
			}
		});

		const newUser: UserCreate = {
			user_name: req.body.username,
			email: req.body.email,
			first_name: req.body.firstName,
			last_name: req.body.lastName,
			password_hash: req.body.password,
			gender: req.body.gender,
			biography: req.body.biography,
			fame_rating: 1,
			stated_location: req.body.stated_location,
			real_location: req.body.real_location,
		}
		const user = await orm?.create("users", newUser);
		if (!user) {
			throw createHttpError(500, "Failed to create user");
		}
		const userId = user.id;

		for (const interest of req.body.interests) {
			await orm?.create("users_interests", {
				name: interest,
				user_id: userId,
			});
		}

		for (const sexualPreference of req.body.sexualPreferences) {
			await orm?.create("users_sexual_preferences", {
				name: sexualPreference,
				user_id: userId,
			});
		}

		res.sendStatus(201);
	} catch (error) {
		next(error);
	}
};

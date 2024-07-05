import { RequestHandler } from "express";
import orm from "../../index";
import createHttpError from "http-errors";

interface userProfile {
    gender: string;
    sexualPreferences: string[];
    biography: string;
    interests: string[];
}

export const getProfile: RequestHandler = async (req, res, next) => {
	try {
		const user = await orm?.read("users", "id", 5);
		if (!user) {
			throw createHttpError(404, "User not found");
		}
        const userProfile: userProfile = {
            gender: user[0].gender,
            sexualPreferences: [],
            biography: user[0].biography,
            interests: [],
        };
		res.status(200).json(userProfile);
	} catch (error) {
		next(error);
	}
};
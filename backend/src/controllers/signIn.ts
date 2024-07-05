import { RequestHandler } from "express";
import createHttpError from "http-errors";
import orm from "../../index";
import env from "../utils/validateEnv";
import jwt from "jsonwebtoken";

interface signInBody {
	username: string;
	password: string;
}

export const signIn: RequestHandler<
	unknown,
	unknown,
	signInBody,
	unknown
> = async (req, res, next) => {

    const { username, password } = req.body;
    
	try {
        if (!username || !password) {
            throw createHttpError(400, "Username and password are required");
        }
        const user = await orm?.read("users", "username", username);
        if (!user) {
            throw createHttpError(404, "User not found");
        }
        const userId = user[0].id;
        const token = jwt.sign({ userId: userId }, env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
		res.status(200).json("Successfully signed in");
	} catch (error) {
		next(error);
	}
};

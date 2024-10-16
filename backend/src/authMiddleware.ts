import { Request, Response, NextFunction } from 'express';
import { UserSettingsInterface } from "./databaseInterfaces";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userSignupModel } from './model/userSignupModel';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserSettingsInterface;
        userId?: string;
    }
}

export async function authenticateWithToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ valid: false });
    }
    if (!JWT_SECRET || JWT_SECRET === null) {
        throw new Error('\n\n\nAuthMiddleware.ts | JWT_SECRET is not defined in the environment variables');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        const userArray = await userSignupModel.readUserByEmail("email", decoded.email);
        const user = userArray ? userArray[0] : null;
        console.log(`\n\n                ********** token (${token}) \n                ********** user.validation_token (${user.validation_token}**********`)
        if (user && user.validation_token === token) {
                req.user = user;
                req.userId = user.id;
            next();
        } else {
            console.log(`\n\n\nAuthMiddleware.ts | Error : authMiddleware backend else du if token (${token}) === user.validation_token (${user.validation_token}`);
            res.status(401).json({ valid: false });
            return;
        }
    } catch (err) {
        console.log(`\n\n\nAuthMiddleware.ts | Error : authMiddleware backend error du try : ${err}`);
        res.status(500).json({ valid: false });
        return;
    }
}
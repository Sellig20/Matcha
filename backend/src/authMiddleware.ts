import { Request, Response, NextFunction } from 'express';
import { UserSettingsInterface } from "./databaseInterfaces";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userSignupModel } from './model/userSignupModel';
import { userSigninModel } from './model/userSigninModel';

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
        throw new Error('\n\nAuthMiddleware.ts | JWT_SECRET is not defined in the environment variables');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
            console.log("\n\nToken décodé:", decoded);
        const userArray = await userSignupModel.readUserByEmail("email", decoded.email);
        const user = userArray ? userArray[0] : null;
        console.log("\n\n\n$$$$$$$$$$$$$$$$$");
        console.log("token = ", token);
        console.log("user.validation_token = ", user.validation_token);
        console.log("\n\n\n$$$$$$$$$$$$$$$$$");
        if (user && user.validation_token === token) {
                req.user = user;
                req.userId = user.id;
            next();
        } else {
            console.log("\n\n\n Error : authMiddleware backend else du if token === token");
            res.status(401).json({ valid: false });
            return;
        }
    } catch (err) {
        console.log("\n\n\n Error : authMiddleware backend err du try ");
        res.status(500).json({ valid: false });
        return;
    }
}
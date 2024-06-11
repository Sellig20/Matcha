import { Request, Response, NextFunction } from 'express';
import { UserSettingsInterface } from "./databaseInterfaces";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { decode } from 'punycode';
import { userSignupModel } from './model/userSignupModel';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserSettingsInterface;
    }
}

export function authenticateWithToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);
    if (!JWT_SECRET || JWT_SECRET === null) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        const email = (decoded as JwtPayload).email
        userSignupModel.findByEmail(email).then((user: UserSettingsInterface | null) => {
            if (!user) return res.sendStatus(403);
            req.user = user;
            next();
        }).catch((error: any) => {
            console.error('Erreur d auth grace au middleware et a jwt', error);
            res.sendStatus(500);
        });
    });
}
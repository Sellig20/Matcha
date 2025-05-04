import { Request, Response, NextFunction } from 'express';
import { UserProfileInterface, UserSettingsInterface } from "./databaseInterfaces";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userSignupModel } from './model/userSignupModel';
import { io } from '../server';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserProfileInterface;
        userId?: string;
    }
}

export async function authenticateWithToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];//protection pour 1 regex
    if (!token) {
        return res.status(401).json({ valid: false });
    }
    if (!JWT_SECRET || JWT_SECRET === null) {//inutile
        throw new Error('\n\n\nAuthMiddleware.ts | JWT_SECRET is not defined in the environment variables');
        //return error 500
    }
    try {
        // wrap around a catch to return 401 on error
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string }; // maybe: embedder seulement le user id dans le token et l'ajouter a la req sans query le user
        const userArray = await userSignupModel.readUserByEmail("email", decoded.email);
        const user = userArray && userArray.length ? userArray[0] : null;
        if (!user || user.validation_token !== token) { // remove token check
            console.log(`\n\n\nAuthMiddleware.ts | Error : authMiddleware backend else du if token (${token}) === user.validation_token (${user.validation_token}`);
            res.status(401).json({ valid: false });
            return;
        }
        req.user = user;
            
        // if (user.id) {
        //     try {
        //         const usertab = await userSignupModel.readUserByEmail();
        //         io.emit('newUser', usertab?.map(user => user.id));//From bdd to socket to AllUser.tsx
        //     } catch (error) {
        //         return res.status(500).json({ valid: false, message: 'Internal server error' });
        //     }
        // }
        next();
    } catch (err) {
        console.log(`\n\n\nAuthMiddleware.ts | Error : authMiddleware backend error du try : ${err}`);
        res.status(500).json({ valid: false });
        return;
    }
}
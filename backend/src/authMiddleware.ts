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
        console.log("\n\nAuthMiddleware.ts | Token reçu dans middleware: ", token);
    if (!token) {
            console.log("\n\nAuthMiddleware.ts | Pas de token dans l'en-tête");
        return res.status(401).json({ valid: false });
    }
    if (!JWT_SECRET || JWT_SECRET === null) {
        throw new Error('\n\nAuthMiddleware.ts | JWT_SECRET is not defined in the environment variables');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
            console.log("\n\nToken décodé:", decoded);
        const user = await userSignupModel.findByEmail(decoded.email);
        if (user && user.validationtoken === token) {
                console.log("\n\n\n AuthMiddleware.ts | -----------------")
                console.log("------- user => ", user);
                console.log("\n\n");
                req.user = user;
                req.userId = user.usersettingsid;
                console.log("user.id = ", user.usersettingsid);
            console.log("\nREQ.USERID => ", req.userId);
            console.log("nananananana");
            next();
        } else {
            console.log("AuthMiddleware.ts | Utilisateur non trouvé ou token invalide\n\n");
            res.status(401).json({ valid: false });
            return;
        }
    } catch (err) {
        console.log("AuthMiddleware.ts | Erreur 500\n\n", err);
        res.status(500).json({ valid: false });
        return;
    }
}
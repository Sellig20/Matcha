import { Request, Response, NextFunction } from 'express';
import { UserSettingsInterface } from "./databaseInterfaces";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { decode } from 'punycode';
import { userSignupModel } from './model/userSignupModel';
import { userLoginModel } from './model/userLoginModel';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserSettingsInterface;
    }
}

export async function authenticateWithToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
        console.log("\n\nToken reçu dans middleware: | authMiddleware.ts ", token);
    if (!token) {
            console.log("\n\nPas de token dans l'en-tête | authMiddleware.ts");
        return res.status(401).json({ valid: false });
    }
    if (!JWT_SECRET || JWT_SECRET === null) {
        throw new Error('\n\nJWT_SECRET is not defined in the environment variables | authMiddleware.ts');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
            console.log("\n\nToken décodé:", decoded);
        const user = await userSignupModel.findByEmail(decoded.email);
        if (user && user.validationtoken === token) {
                console.log("\n\n\n authMiddleware.ts -----------------\n\n")
                console.log("------- token => ", token);
                console.log("------- user => ", user);
                console.log("\n\n");
            req.user = user;
            next();
        } else {
            console.log("Utilisateur non trouvé ou token invalide | authMiddleware.ts\n\n");
            res.status(401).json({ valid: false });
        }
    } catch (err) {
        console.log("Erreur 500 authMiddleware.ts\n\n", err);
        res.status(500).json({ valid: false });
    }
}
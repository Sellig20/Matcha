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
    console.log("Token reçu dans middleware:", token);
    if (!token) {
        console.log("Pas de token dans l'en-tête");

        return res.status(401).json({ valid: false });
    }
    if (!JWT_SECRET || JWT_SECRET === null) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    // jwt.verify(token, JWT_SECRET, (err, decoded) => {
    //     if (err) return res.sendStatus(403);
    //     const email = (decoded as JwtPayload).email;
    //     console.log("\n---> email: ", email);
    //     userSignupModel.findByEmail(email).then((user: UserSettingsInterface | null) => {
    //         if (!user) return res.sendStatus(403);
    //         req.user = user;
    //         console.log("\n--> user: ", user);
    //         console.log("\n--> req.user: ", req.user);
    //         next();
    //     }).catch((error: any) => {
    //         console.error('Erreur d auth grace au middleware et a jwt', error);
    //         res.sendStatus(500);
    //     });
    // });
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        console.log("Token décodé:", decoded);

        const user = await userSignupModel.findByEmail(decoded.email);
        console.log("\n\nuser -> ", user);
        console.log("user.token -> ", user.validationtoken);
        console.log("token -> ", token);
        console.log("\n\n");
        if (user && user.validationtoken === token) {
            req.user = user;
            next();
        } else {
            console.log("Utilisateur non trouvé ou token invalide");
            res.status(401).json({ valid: false });
        }
    } catch (err) {
        console.log("Erreur 500 middleeeewareee dans middleware de vérification du token:", err);

        res.status(500).json({ valid: false });
    }
}
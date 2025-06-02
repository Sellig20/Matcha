import { Request, Response } from "express";
import { userSigninModel } from '../model/userSigninModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class userSigninController {
    static async getLogin(req: Request, res: Response) {
        try {
            //ca doit aller chercher l'id du user dans le jwt OU si celui ci est expiré, lui creer un autre ID a ;ettre dans le jwt grace a son email deja enregistré
            const { email, password } = req.body;
            const validUser = await userSigninModel.getLogin(email, password); // use read user
            if (!validUser) {
                res.status(400).json({ message: 'UserSigninController.ts | Email not found' });
                return;
            }
            if (!JWT_SECRET) {
                return res.status(400).json({ message: 'serSigninController.ts | getLogin | WT_SECRET is not defined in the environment variables' });
            }
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '10h' });
            await userSigninModel.storeNewToken(email, token, validUser.id);
            res.status(200).json({
                message: "UserSigninController.ts | Auth successfull welcome in the app",
                token: token,
                user: validUser // pas utile
            });
        } catch (err: any) { // return 500
            console.error("\nuserSigninController -> ", err);
            if (err == "TypeError: Cannot read properties of null (reading 'password_hash')") { // remove all this
                res.status(401).json( { message: "Check the email. Does it exist ?" } );
            }
            else {
                res.status(401).json( { message: err.message } );
            }
            return;
        }
    }
}

import { Request, Response } from "express";
import { userSigninModel } from '../model/userSigninModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class userSigninController {
    static async getLogin(req: Request, res: Response) {
        try {
                console.log("---------- Dans le controller de Login\n");

            const { email, password } = req.body;
                console.log("\n\nMODEL signin, email = ", email);
                console.log("MODEL signin, password = ", password, "\n\n");

            const validUser = await userSigninModel.getLogin(email, password);

            if (!validUser) {
                res.status(400).json({ message: 'UserSigninController.ts | Email not found' });
                return;
            }

                console.log("\nusersignincontroller: user found : ", email, " | ", password);
                console.log("valid user is ", validUser);
            
            if (!JWT_SECRET || JWT_SECRET === null) {
                throw new Error('UserSigninController.ts | JWT_SECRET is not defined in the environment variables');
            }
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });  
            await userSigninModel.storeNewToken(email, token);
            res.json({
                message: "Auth successfull welcome in the app",
                token: token,
                user: validUser
            });
        } catch (err) {
                console.error(err);
            res.status(401).json('xxxxx Erreur dauthentification xxxxxx');
            return;
        }
    }
}

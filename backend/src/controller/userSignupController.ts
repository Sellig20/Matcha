import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserSettingsInterface } from "../databaseInterfaces";
import dotenv from 'dotenv';
import { AsyncLocalStorage } from "async_hooks";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class userSignupController {
    static async signup(req: Request, res: Response) {
        try {
                console.log("+++++++++++++  CONTROLLER SIGNUP  +++++++++++++");
            const { firstname, lastname, email, password } = req.body;
                console.log("\nreq.body = ", req.body);
                console.log("\nfn = ", firstname, "\nln = ", lastname, "\nemail =", email, "\npassw=", password);


            const existingUser = await userSignupModel.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: 'Cette adresse mail deja utilisee bro' });
                return;
            }

            const hashedPwd = await bcrypt.hash(password, 10);
            const newUser: UserSettingsInterface = { usersettingsid: 10, userprofileid: 10, validationtoken: "default", isvalidatedtoken:false, firstname, lastname, email, pass_word: hashedPwd};
            await userSignupModel.createNewUser(newUser);

            if (!JWT_SECRET || JWT_SECRET === null) {
                throw new Error('JWT_SECRET is not defined in the environment variables');
            }

            const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
                console.log("\nLe token généré pour : ", firstname, lastname, "\n est : ", token, "\n sont mot de passe est : ", hashedPwd, "\n");
            await userSignupModel.addTokenInBdd(token, newUser.email);
            res.status(201).json({ message: 'Inscription ok', token });

        } catch (err) {
                console.error('Erreur lors de linscription: ', err);
            res.status(500).json({ message: 'Erreur pdt linscrpiton' });
        }
    }

}

    export async function verifyToken(req: Request, res: Response) {
        try {
            const token = req.cookies.token; // Récupérer le token des cookies
            if (!token) {
                return res.status(401).json({ valid: false });
            }
            if (!JWT_SECRET || JWT_SECRET === null) {
                throw new Error('JWT_SECRET is not defined in the environment variables');
            }
            const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
            const user = await userSignupModel.findByEmail(decoded.email);
            if (user && user.token === token) {
                res.status(200).json({ valid: true });
            } else {
                res.status(401).json({ valid: false });
            }
        } catch (err) {
            res.status(500).json({ valid: false });
        }
    }
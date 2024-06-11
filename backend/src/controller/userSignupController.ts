import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserSettingsInterface } from "../databaseInterfaces";
import dotenv from 'dotenv';
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
                console.log("------------- apres token jwt.sign controllersignup-------------------");
                console.log("\nLe token généré pour : ", firstname, lastname, "\n est : ", token, "\n sont mot de passe est : ", hashedPwd, "\n");
            await userSignupModel.addTokenInBdd(token, newUser.email);
            res.status(201).json({ message: 'Inscription ok', token });
        } catch (err) {
                console.error('Erreur lors de linscription: ', err);
            res.status(500).json({ message: 'Erreur pdt linscrpiton' });
        }
    }
}
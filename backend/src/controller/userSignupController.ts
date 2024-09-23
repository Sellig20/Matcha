import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { userModel } from "../model/userSignupModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserSettingsInterface } from "../databaseInterfaces";
import dotenv from 'dotenv';
import { UserCreate } from "../orm/schema";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class userSignupController {
    static async signup(req: Request, res: Response) {
        try {
            const { firstname, lastname, email, password } = req.body;
                // console.log("\nUserSignupController.ts | req.body = ", req.body);
                // console.log("\nUserSignupController.ts |\n fn = ", firstname, "\nln = ", lastname, "\nemail =", email, "\npassw=", password);
            
            const existingUserAlready = await userModel.readUser("email", email);
            if (existingUserAlready) {
                res.status(400).json({ message: 'UserSignupController.ts | Cette adresse mail deja utilisee bro' });
                return;
            }

            const hashedPwd = await bcrypt.hash(password, 10);

            if (!JWT_SECRET || JWT_SECRET === null) {
                throw new Error('UserSignupController.ts | JWT_SECRET is not defined in the environment variables');
            }
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });  
                // console.log("\nUserSignupController.ts | Le token généré pour : ", firstname, lastname, "\n est : ", token, "\n sont mot de passe est : ", hashedPwd, "\n");
            // await userSignupModel.addTokenInBdd(token, email);
            
            const newUser: UserSettingsInterface = {
                token,
                isvalidatedtoken: false,
                firstname,
                lastname,
                email,
                pass_word: hashedPwd
            };

            const newUser2: UserCreate = {
                user_name: "",
                email: email,
                first_name: firstname,
                last_name: lastname,
                password_hash: hashedPwd,
                gender: "",
                biography: "",
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                age_lower_bound: 0,
                age_upper_bound: 0,
              }
              
            
            const response = userModel.createUser(newUser2);
            // console.log("\n\n\nIdentity of the user is ", userSettingsID, "\n\n\\n");
            res.status(201).json({ message: 'UserSignupController.ts | Inscription ok', token });
        } catch (err) {
                console.error('UserSignupController.ts | Erreur lors de linscription: ', err);
            res.status(500).json({ message: 'UserSignupController.ts | Erreur pdt linscrpiton' });
            return;
        }
    }
}
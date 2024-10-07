import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserCreate } from "../orm/schema";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class userSignupController {
    static async signup(req: Request, res: Response) {
        try {
            const { firstname, lastname, email, password } = req.body;
            const existingUserAlready = await userSignupModel.readUserByEmail("email", email);
            if (existingUserAlready) {
                res.status(400).json({ message: 'UserSignupController.ts | Email already existing in the database' });
                return;
            }

            const hashedPwd = await bcrypt.hash(password, 10);

            if (!JWT_SECRET || JWT_SECRET === null) {
                throw new Error('UserSignupController.ts | JWT_SECRET is not defined in the environment variables');
            }
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        
            const newUser: UserCreate = {
                user_name: "",
                email: email,
                first_name: firstname,
                last_name: lastname,
                age: 0,
                password_hash: hashedPwd,
                validation_token: token,
                gender: "",
                biography: "",
                sexual_interest: "",
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                age_lower_bound: 0,
                age_upper_bound: 0,
              }
            
            const response = userSignupModel.createUser(newUser);
            res.status(201).json({ message: 'UserSignupController.ts | Inscription success', token });
        } catch (err) {
            res.status(500).json({ message: 'UserSignupController.ts | Error during inscription' });
            return;
        }
    }
}
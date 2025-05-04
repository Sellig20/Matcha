import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserCreate } from "../orm/schema";
import { io } from '../../server';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export class userSignupController {
    
    static async signup(req: Request, res: Response) {
        try {
            const { firstname, lastname, email, password } = req.body;
            const existingUser = await userSignupModel.readUserByEmail("email", email);//by id
            if (existingUser) {
                return res.status(400).json({ message: 'UserSignupController.ts | signup | Error while authenticating' });
            }
            // regles du passwd dont taille max 
            const hashedPwd = await bcrypt.hash(password, 10);

            if (!JWT_SECRET) {
                res.status(500).json({ message: 'UserSignupController.ts | signup | Error while authenticating' });
                return;
            }
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '10h' }); // maybe id
        
            const newUser: UserCreate = {
                user_name: "",
                email: email,
                first_name: firstname,
                last_name: lastname,
                age: 0,
                age_lower_bound: 0,
                age_upper_bound: 0,
                password_hash: hashedPwd,
                validation_token: token, // ADRIEN remove from db
                gender: "",
                biography: "",
                sexual_interest: "",
                tags_1: "",
                tags_2: "",
                tags_3: "",
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                is_profile_completed: false,
            };
            await userSignupModel.createUser(newUser);
            res.status(201).json({ message: 'UserSignupController.ts | Inscription success', token });
        } catch (error) {
            res.status(500).json({ message: `UserSignupController.ts | Error during inscription : ${error}` });
            return;
        }
    }

    static async isProfileComplete(req: Request, res: Response) {
        try {
            const id = req.userId;
            const userArray = await userSignupModel.readUserByEmail("id", id);
            if (!userArray || !userArray.length) {
                return res.status(400).json({ message: 'UserSignupController.ts | Error getting profile for isprofilecompleted'});
            }
            const isProfileCompleted = userArray[0].is_profile_completed;
            res.status(201).json({ message: 'UserSignupController.ts | Success getting is profile complete', isProfileCompletedDB: isProfileCompleted});
        } catch (error) {
            res.status(500).json({ message: `UserSignupController.ts | Error during getting is profile complete : ${error}` });
            return;
        }
    }
}
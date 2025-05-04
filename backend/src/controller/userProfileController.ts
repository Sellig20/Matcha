import { Request, Response } from "express";
import {userProfileModel }from '../model/userProfileModel';
import { UserCreate } from "../orm/schema";
import { userSignupModel } from "../model/userSignupModel";
import { io } from '../../server';

export class userProfileController {
    static async joinNewProfile(req: Request, res: Response) {//TO CREATE NEW PROFILE
        try {
            const userId = req.userId; // useless, already checked in middleware
            if (!userId) {
                return res.status(400).json({ message: 'UserProfileController.ts | Error user id not found in request' });
            }
            const alreadyUser = await userProfileModel.displayProfile("id", userId);
            const midUser = alreadyUser ? alreadyUser[0] : null; // replace by user read first
            const userIdNumber = parseInt(userId, 10); // to figure out
            const achieveUser: UserCreate = {
                user_name: req.body.username,
                email: midUser.email,
                first_name: midUser.first_name,
                last_name: midUser.last_name,
                age: req.body.age,
                age_lower_bound: req.body.age_lower_bound,
                age_upper_bound: req.body.age_upper_bound,
                password_hash: midUser.password_hash,
                validation_token: midUser.validation_token,
                gender: req.body.gender,
                biography: req.body.biography,
                sexual_interest: req.body.sexual_interest,
                tags_1: req.body.tags_1,
                tags_2: req.body.tags_2,
                tags_3: req.body.tags_3,
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                is_profile_completed: true,
            }
            io.emit('is_profile_complete', 'true'); // useless
            const response = await userSignupModel.updateUserToken(userIdNumber, achieveUser); 
            res.status(201).json({ message: `userProfileController.ts | Fill profile success`, response});
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    // useles (route 1 is enough)
    static async updateUserSettings(req: Request, res: Response) {//TO UPDATE USER SETTINGS
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'UserProfileController.ts | Error user id not found in request' });
            }
            const userIdNumber = parseInt(userId, 10);
            const alreadyUser = await userProfileModel.displayProfile("id", userId);
            const midUser = alreadyUser ? alreadyUser[0] : null;
            const updateData: UserCreate = {
                user_name: midUser.username,
                email: midUser.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                age: midUser.age,
                age_lower_bound: midUser.age_lower_bound,
                age_upper_bound: midUser.age_upper_bound,
                password_hash: midUser.password_hash,
                validation_token: midUser.validation_token,
                gender: midUser.gender,
                biography: midUser.biography,
                sexual_interest: midUser.sexual_interest,
                tags_1: midUser.tags_1,
                tags_2: midUser.tags_2,
                tags_3: midUser.tags_3,
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                is_profile_completed: midUser.is_profile_completed,
            }
            const response = await userSignupModel.updateUserToken(userIdNumber, updateData);
            res.status(201).json({ message: `userProfileController.ts | Update user settings success`, response});
        } catch (err) {//ne remplit pas si ya pas le reste
            return res.status(500).json({ message: 'Server error', err });
        }
    }

    static async displayProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) { // useless
                return res.status(400).json({ message: 'UserProfileController.ts | Error user id not found in request' });
            }
            const displayProfile = await userProfileModel.displayProfile("id", userId);
            res.status(201).json({ message: 'UserProfileController.ts | profile complete', displayProfile });
        } catch (err) {
            res.status(500).json({ error: 'UserProfileController.ts | Error something went srong '});
        }
    }

    // static async displayOtherProfile(req: Request, res: Response, id: number) {
    //     try {
    //         const displayProfile = await userProfileModel.displayProfile("id", id);
    //         res.status(201).json({ message: 'UserProfileController.ts | profile complete', displayProfile });
    //     } catch (err) {
    //         res.status(500).json({ error: 'UserProfileController.ts | Error something went srong '});
    //     }
    // }

    // static async createNewProfile(req: Request, res: Response, displayUser: any) {
    //     try {
    //         const { firstname, lastname, email, hashedPwd } = req.body;
            
    //         const newUser: UserCreate = {
    //             user_name: "",
    //             email: email,
    //             first_name: firstname,
    //             last_name: lastname,
    //             age: 0,
    //             age_lower_bound: 0,
    //             age_upper_bound: 0,
    //             password_hash: hashedPwd,
    //             validation_token: "",
    //             gender: "",
    //             biography: "",
    //             sexual_interest: "",
    //             tags_1: "",
    //             tags_2: "",
    //             tags_3: "",
    //             fame_rating: 0,
    //             stated_location: "",
    //             real_location: "",
    //             is_profile_completed: false,
    //           }
    //         await userProfileModel.createNewProfile(newUser);
    //         res.status(201).json({ message: 'UserProfileController.ts | new profile ok'});
    //     } catch(err) {
    //         res.status(500).json({ message: 'UserProfileController.ts | Erreur pdt la creation du profile' });
    //         return;
    //     }
    // }
}
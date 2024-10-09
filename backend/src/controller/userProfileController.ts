import { Request, Response } from "express";
import {userProfileModel }from '../model/userProfileModel';
import { UserCreate } from "../orm/schema";
import { userSignupModel } from "../model/userSignupModel";

export class userProfileController {
    static async getUserIdProfile(req: Request, res: Response) {//TO CREATE NEW PROFILE
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'UserProfileController.ts | Error user id not found in request' });
            }
            const alreadyUser = await userProfileModel.displayProfile("id", userId);
            const midUser = alreadyUser ? alreadyUser[0] : null;
            const userIdNumber = parseInt(userId, 10);
            const achieveUser: UserCreate = {
                user_name: req.body.username,
                email: midUser.email,
                first_name: midUser.first_name,
                last_name: midUser.last_name,
                age: req.body.age,
                password_hash: midUser.password_hash,
                validation_token: midUser.validation_token,
                gender: req.body.gender,
                biography: req.body.biography,
                sexual_interest: req.body.sexual_interest,
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                age_lower_bound: 0,
                age_upper_bound: 0,
            }
            const response = await userSignupModel.updateUserToken(userIdNumber, achieveUser);
            res.status(201).json({ message: `userProfileController.ts | Fill profile success`, response});
        } catch (err) {
            return res.status(500).json({ message: 'Server error', err });
        }
    }

    static async displayProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'UserProfileController.ts | Error user id not found in request' });
            }
            const displayProfile = await userProfileModel.displayProfile("id", userId);
            if (displayProfile) {
                console.log("\n-----------------\n DISPLAY PROFILE from userProfileController.ts => ", displayProfile);
                const gogo = displayProfile[0].user_name;
                const isProfileComplete = true;
                res.status(201).json({ message: 'UserProfileController.ts | profile complete', displayProfile, isProfileComplete });
            }
            else {
                const isProfileComplete = false;
                res.status(422).json({ message: 'UserProfileController.ts | profile incomplete', displayProfile, isProfileComplete });
                return ;
            }
        } catch (err) {
            res.status(500).json({ error: 'UserProfileController.ts | Error something went srong '});
        }
    }

    static async createNewProfile(req: Request, res: Response, displayUser: any) {
        try {
            const { firstname, lastname, email, password, hashedPwd, username, age, gender, sexualInterest, biography, tags, hasProfilePicture } = req.body;
            
            const newUser: UserCreate = {
                user_name: "",
                email: email,
                first_name: firstname,
                last_name: lastname,
                age: 0,
                password_hash: hashedPwd,
                validation_token: "",
                gender: "",
                biography: "",
                sexual_interest: "",
                fame_rating: 0,
                stated_location: "",
                real_location: "",
                age_lower_bound: 0,
                age_upper_bound: 0,
              }
            const userProfileId = await userProfileModel.createNewProfile(newUser);
            const isProfileComplete = true;
            res.status(201).json({ message: 'UserProfileController.ts | new profile ok', isProfileComplete });
        } catch(err) {
            const isProfileComplete = false;
            res.status(500).json({ message: 'UserProfileController.ts | Erreur pdt la creation du profile', isProfileComplete });
            return;
        }
    }
}
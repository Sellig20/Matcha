import { Request, Response } from "express";
import {userProfileModel }from '../model/userProfileModel';
import { UserProfileInterface } from "../databaseInterfaces";
import { UserCreate } from "../orm/schema";
export class userProfileController {
    static async getUserIdProfile(req: Request, res: Response) {//TO CREATE NEW PROFILE
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'UserProfileController.ts | Error user id not found in request' });
            }
            // const displayUser = await userProfileModel.getUserIdProfile(userId, "", "");
            //rajouter une verification si userIdModel == req.userId
            // res.status(200).json({
            //     displayUser
            // })
            // const newProfile = userProfileController.createNewProfile(req, res, userId);

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
                console.log("\n-----------------\n DISPLAY PROFILE => ", displayProfile);
                const isProfileComplete = true;
                res.status(201).json({ message: 'UserProfileController.ts | profile complete', displayProfile, isProfileComplete });
            }
            else {
                console.log("\n\n\n\n oh no no non o no");
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
                password_hash: hashedPwd,
                validation_token: "",
                gender: "",
                biography: "",
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
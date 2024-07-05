import { Request, Response } from "express";
import {userProfileModel }from '../model/userProfileModel';
import { UserProfileInterface } from "../databaseInterfaces";
export class userProfileController {
    static async getUserIdProfile(req: Request, res: Response) {//TO CREATE NEW PROFILE
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in request' });
            }
            const displayUser = await userProfileModel.getUserIdProfile(userId);
            //rajouter une verification si userIdModel == req.userId
            // console.log("\n\n\n userprofilecontroller.ts | display user => ", displayUser , "\n\n\n");
            // res.status(200).json({
            //     displayUser
            // })
            const newProfile = userProfileController.createNewProfile(req, res, userId);
            console.log("------------------------------------------______________________________> ", newProfile);

        } catch (err) {
            return res.status(500).json({ message: 'Server error', err });
        }
    }

    static async displayProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in request' });
            }
            const displayProfile = await userProfileModel.displayProfile(userId);
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
            // console.log("UserprofileController.ts | display profile | error is : ", err);
            res.status(500).json({ error: 'Something went srong '});
        }
    }

    static async createNewProfile(req: Request, res: Response, displayUser: any) {
        try {
            const { username, age, gender, sexualInterest, biography, tags, hasProfilePicture } = req.body;
            // console.log("UserProfileController.ts CREATE NEW PROFILE | req.body = ", req.body);
            const newProfile: UserProfileInterface = {
                usersettingsid: displayUser,
                username,
                age,
                gender,
                sexualInterest,
                biography,
                tags,
                hasProfilePicture
            };
            const userProfileId = await userProfileModel.createNewProfile(newProfile);
            // console.log("UserProfileController.ts | after call to model for newProfileUSER : ", userProfileId, "\n\n");
            const isProfileComplete = true;
            res.status(201).json({ message: 'UserProfileController.ts | new profile ok', isProfileComplete });
        } catch(err) {
            const isProfileComplete = false;
            // console.error('UserProfileController.ts | Erreur pdt la creation du profile: ', err);
            res.status(500).json({ message: 'UserProfileController.ts | Erreur pdt la creation du profile', isProfileComplete });
            return;
        }
    }
}
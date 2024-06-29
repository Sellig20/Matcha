import { Request, Response } from "express";
import {userProfileModel }from '../model/userProfileModel';
import { UserProfileInterface } from "../databaseInterfaces";
export class userProfileController {
    static async getUserIdProfile(req: Request, res: Response) {
        try {
            console.log("\n\n\nuserProfileController.tsx | try to display profile\n\n\n");
            // console.log("id du user -> ", id);
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in request' });
            }
            console.log("\n\n\n userprofilecontroller.ts ++++++++ ", userId, " ++++++++++\n\n\n");
            const displayUser = await userProfileModel.getUserIdProfile(userId);
            //rajouter une verification si userIdModel == req.userId
            console.log("\n\n\n userprofilecontroller.ts | display user => ", displayUser , "\n\n\n");
            // res.status(200).json({
            //     displayUser
            // })
            userProfileController.createNewProfile(req, res, userId);
    } catch (err) {
            console.error(err);
        }
    }

    static async displayProfile(req: Request, res: Response) {
        try {
            const userId = req.userId;
            const displayProfile = await userProfileModel.displayProfile(userId);
        } catch (err) {
            console.log("UserprofileController.ts | display profile | error is : ", err);
        }
    }

    static async createNewProfile(req: Request, res: Response, displayUser: any) {
        try {
            const { username, age, gender, sexualInterest, biography, tags, hasProfilePicture } = req.body;
            console.log("UserProfileController.ts CREATE NEW PROFILE | req.body = ", req.body);
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
            console.log("UserProfileController.ts | after call to model for newProfileUSER : ", userProfileId, "\n\n");
            res.status(201).json({ message: 'UserProfileController.ts | new profile ok' });
        } catch(err) {
            console.error('UserProfileController.ts | Erreur pdt la creation du profile: ', err);
            res.status(500).json({ message: 'UserProfileController.ts | Erreur pdt la creation du profile' });
            return;
        }
    }
}
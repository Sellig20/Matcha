import { Request, Response } from "express";
import {userProfileModel }from '../model/userProfileModel';
export class userProfileController {
    static async displayProfile(req: Request, res: Response) {
        try {
            console.log("\n\n\nuserProfileController.tsx | try to display profile\n\n\n");
            // console.log("id du user -> ", id);
            const { userId } = req.body;
            console.log("\n\n\n userprofilecontroller.ts ++++++++ ", userId, " ++++++++++");
            const displayUser = await userProfileModel.displayProfile(userId);
            console.log("\n\n\n userprofilecontroller.ts | display user => ", displayUser, "\n\n\n");
        } catch (err) {
            console.error(err);
        }
    }
}
import { Request, Response } from "express";

export class userProfileController {
    static async displayProfile(req: Request, res: Response) {
        try {
            console.log("\n\nuserProfileController.tsx | try to display profile");
            // console.log("id du user -> ", id);
        } catch (err) {
            console.error(err);
        }
    }
}
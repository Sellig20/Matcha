import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import {client} from '../../redis'
import { UsersProfilesViewsCreate } from "../orm/schema";

export class viewsFameRatingController {
    static async recordProfileViews(req: Request, res: Response) {
        try {
            //ajouter les vues du user dans le schema de la bdd en fonction de leur ID
            console.log("\n\n\n\n\n\n\n\n---------------------------");
            console.log("\nje matte : ", req.body.viewed_id);
            console.log("\nje matte : ", req.body.viewed_first_name);
            console.log("\nje suis : ", req.body.viewer_id);
            console.log("\nje suis : ", req.body.viewer_first_name);
            console.log("\n\n\n\n\n\n\n\n---------------------------");
            const tableView: UsersProfilesViewsCreate = {
                user_viewer_id: req.body.viewer_id,
                user_viewed_id: req.body.viewed_id,
                view_started_on: new Date().toISOString(),
                view_ended_on: new Date(Date.now() + 3600000).toISOString(),
            };
            const reso = await userSignupModel.createViews(tableView);
            console.log("\n\n\n res =========================== ", reso);
            res.status(201).json({ message: `views ok` });
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during recording views : ${error}` });
            return;
        }
    }

    static async getListUsers(req: Request, res: Response) {//For AllUsers.tsx, from bdd
        try {
            const listTab = await userSignupModel.readUserByEmail();
            const list = listTab?.map(user => user.id);
            res.status(201).json({ message: `List of all users`, list});
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during get list users : ${error}` });
            return;
        }
    }

    static async readProductProfile(req: Request, res:Response) {
        try {
            const value = req.params.idd;
            const productProfile = await userSignupModel.readUserByEmail("id", value);
            console.log(" \n\n+++++ ", productProfile, "\n\n");
            if (productProfile && productProfile.length > 0) {
                res.status(201).json({ productProfile: productProfile[0] });
            } else {
                res.status(400).json({ message: "User to view not found "});
            }
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during product profile user : ${error}` });
            return;
        }
    }
}
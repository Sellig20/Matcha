import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import {client} from '../../redis'
import { UsersLikesCreate, UsersProfilesViewsCreate } from "../orm/schema";
import { SocketClosedUnexpectedlyError } from "redis";
import { io } from '../../server';
import { table } from "console";


export class viewsFameRatingController {
    static async recordProfileViews(req: Request, res: Response) {
        try {
            const tableView: UsersProfilesViewsCreate = {
                id: req.body.id,
                user_viewer_id: req.body.viewer_id,
                user_viewed_id: req.body.viewed_id,
                view_started_on: new Date().toISOString(),
                view_ended_on: new Date(Date.now() + 3600000).toISOString(),
            };
            await userSignupModel.createViews(tableView);
            io.emit('insert_view', tableView);
            res.status(201).json({ message: `views ok` });
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during recording views : ${error}` });
            return;
        }
    }

    static async recordProfileLikes(req: Request, res: Response) {
        try {
            const tableLikes: UsersLikesCreate = {
                user_id: req.body.user_id,
                liked_user_id: req.body.liked_user_id,
                liked_on: new Date().toISOString(),
            };
            await userSignupModel.createLikes(tableLikes);
            io.emit('insert_likes', tableLikes);
            res.status(201).json({ message: `likes ok` });
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during recording likes : ${error}` });
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

    static async getWhoViewedMe(req: Request, res: Response) {
        try {
            const value = req.params.idd;
            const numberViewed = await userSignupModel.readViewed("user_viewed_id", value);
            res.status(201).json({ message: `get who viewed me ok`, numberViewed });
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during get who viewed me : ${error}` });
        }
    }

    static async getWhoLikedMe(req: Request, res: Response) {
        try {
            const value = req.params.idd;
            const numberLikes = await userSignupModel.readLikes("liked_user_id", value);
            res.status(201).json({ message: `get who likes me ok`, numberLikes });
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during get who likes me : ${error}` });
        }
    }
}
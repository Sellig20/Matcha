import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import {client} from '../../redis'
import { UsersLikesCreate, UsersProfilesViewsCreate } from "../orm/schema";
import { io } from '../../server';
import { table } from "console";

export class fameRatingController {
    static async recordProfileViews(req: Request, res: Response) {
        try {
            //creation de la vue + recup du first_name
            const value = req.body.viewed_id;
            const firstNameBdd = await userSignupModel.readFirstName("id", req.body.viewer_id);
            
            const tableView: UsersProfilesViewsCreate = {
                first_name: firstNameBdd,
                user_viewer_id: req.body.viewer_id,
                user_viewed_id: req.body.viewed_id,
                view_started_on: new Date().toISOString(),
                view_ended_on: new Date(Date.now() + 3600000).toISOString(),
            };
            console.log("\n\n tableView, = ", tableView, "\n\n");
            const result = await userSignupModel.createViews(tableView);
            //je nenvoie pas result au frontend je ne marche quen socket a voir
            io.emit('insert_view', tableView);
            const count = await this.countViews(value);
            io.emit('update_countViews', count);
            res.status(201).json({ message: `views ok`});
        } catch (error) {
            res.status(500).json({ message: `\n\nfameRatingController.ts | Error during recording views : ${error}\n\n` });
            return;
        }
    }
    
    static async recordProfileLikes(req: Request, res: Response) {
        try {
            const firstNameBdd = await userSignupModel.readFirstName("id", req.body.liker_user_id);
            console.log("fn => ", firstNameBdd);
            const tableLikes: UsersLikesCreate = {
                user_id: req.body.user_id,
                first_name: firstNameBdd,
                liked_user_id: req.body.liked_user_id,
                liker_user_id: req.body.liker_user_id,
                liked_on: new Date().toISOString(),
            };
            await userSignupModel.createLikes(tableLikes);
            console.log("\n\n likes => ", tableLikes);
            const value = req.body.liker_user_id;
            io.emit('insert_likes', tableLikes, "\n\n");
            const count = await this.countLikes(value);
            io.emit('update_countLikes', count);
            res.status(201).json({ message: `likes ok` });
        } catch (error) {
            res.status(500).json({ message: `\n\nfameRatingController.ts | Error during recording likes : ${error}\n\n` });
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
            res.status(500).json({ message: `\n\nfameRatingController.ts | Error during product profile user : ${error}\n\n` });
            return;
        }
    }
    
    static async getViewerProfile(user_viewer_id: number) {
        const profile = await userSignupModel.readUserByEmail("id", user_viewer_id.toString());
        if (profile)
            return profile[0].first_name;
    }
    
    static async countViews(value: any) {
        try {
            const profile = await userSignupModel.readAnything("users_profiles_views", "user_viewed_id", value);
            const viewerCounts: { [key: string]: number } = {};
            profile?.forEach(ind => {
                const viewer = ind.user_viewer_id;
                if (viewerCounts[viewer]) {
                    viewerCounts[viewer] += 1;
                }
                else {
                    viewerCounts[viewer] = 1;
                }
            })
            let total: number = 0;
            Object.entries(viewerCounts).forEach(([viewerId, count]) => {
                const countInt = Number(count);
                total += countInt;
            })
            return total;
        } catch (error) {
            return null;
        }
    }

    static async countLikes(value: any) {
        try {
            let count: number = 0;
            count += 1;

            const profile = await userSignupModel.readAnything("users_profiles_views", "user_viewed_id", value);
            //count le nombre d'entrees de la table like
            return count;
        } catch (error) {
            return null;
        }
    }
    
    static async getWhoViewedMe(req: Request, res: Response) {
        try {
            const value = req.params.idd;
            const numberViewed = await userSignupModel.readViewed("user_viewed_id", value);
            if (numberViewed) {
                const ProfilesViewsTab = await Promise.all(numberViewed.map(async (view) => {
                    const profiles = await userSignupModel.readUserByEmail("id", view.user_viewer_id);
                    if (profiles) {
                        return {
                            ...view,
                            first_name: profiles[0].first_name,
                        }
                    }
                }));
                // io.emit('insert_name', ProfilesViewsTab);
                // io.emit('update_count', count);
                const count = await this.countViews(value);
                res.status(201).json({ message: `get who viewed me ok`, ProfilesViewsTab, count});
            }
            else
                res.status(204).json( {message : `fameRatingController.ts | No content for views `} );
            //rajouter leur nom via la fonction d'au dessus faire un tableau deux en un et les afficher en frontend puis faire un count total en frontend puis fame rating
        } catch (error) {
            res.status(201).json({ message: `\n\nfameRatingController.ts | Error during get who viewed me : ${error}\n\n` });
        }
    }

    static async getWhoLikedMe(req: Request, res: Response) {
        try {
            const value = req.params.idd;
            const numberLikes = await userSignupModel.readLikes("liked_user_id", value);
            if (numberLikes) {
                const ProfilesLikesTab = await Promise.all(numberLikes.map(async (like) => {
                    const profiles = await userSignupModel.readUserByEmail("id", like.user_id);
                    if (profiles) {
                        return {
                            ...like,
                            first_name: profiles[0].first_name,
                        }
                    }
                    // console.log("===****>> ", ProfilesLikesTab);
                }))
                res.status(201).json({ message: `get who viewed me ok`, ProfilesLikesTab });
            }
            else
                res.status(204).json( {message : `fameRatingController.ts | No content for likes `} );
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get who likes me : ${error}` });
        }
    }

    static async getMatchs(req: Request, res: Response) {
        try {
            // le but cest de dire : si Andre ma like et que je lai like alors match = 1
            //return le nombre de matche en tableau avec son nom pour afficher dans le fame rating
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get matchs : ${error}` });
        }
    }
}
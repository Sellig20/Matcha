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
            const existingLike = await userSignupModel.readLikes("liker_user_id", req.body.liker_user_id);

                //LE LIKE EXISTE IL DEJA AVANT QUE JE LE CREE ?
            if (existingLike && existingLike[0].liked_user_id === req.body.liked_user_id
                && existingLike[0].liker_user_id === req.body.liker_user_id) {
                    return res.status(200).send({ success: false, message: "Like déjà existant." });
                }

                // CREER LE LIKE
            const tableLikes: UsersLikesCreate = {
                user_id: req.body.user_id,
                first_name: firstNameBdd,
                liked_user_id: req.body.liked_user_id,
                liker_user_id: req.body.liker_user_id,
                liked_on: new Date().toISOString(),
            };//les infos de celui qui a liké sont envoyées au frontend de celui qui est liké
            await userSignupModel.createLikes(tableLikes);
            console.log("\n\n likes => ", tableLikes);
            const value = req.body.liker_user_id;
            io.emit('insert_likes', tableLikes, "\n\n");
            const count = await this.countLikes(value);
            io.emit('update_countLikes', count);
            res.status(201).json({ success: true, message: `likes ok` });
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
    
    static async updateProfileLikes(req: Request, res: Response) {
        try {
            
            console.log("\n liked ", req.body.liked_user_id);
            console.log("\n liker ", req.body.liker_user_id);
            console.log("\n id ", req.body.liked_user_id);

            const existingLike = await userSignupModel.readLikes("liker_user_id", req.body.liker_user_id);
            let valueToUpdate: boolean = false;
            let likeId: number = 0;
            if (existingLike) {
                for (let j = 0; j < existingLike.length; j++) {
                    if (existingLike[j].liked_user_id == req.body.liked_user_id
                        && existingLike[j].liker_user_id == req.body.liker_user_id
                    ) {
                        console.log("\n *************************** !!!!!@@@@@ le like existe bien !");
                        console.log("like existant => ", existingLike[j]);
                        //detruire le like et passer alreadylike a false et renvoyer au frontend
                        // listName[i].alreadyLike = true;
                        likeId = existingLike[j].id;
                    }
                }
                const suppression = await userSignupModel.deleteLike(likeId);
                console.log("suppression = ", suppression);
            }
            io.to(req.body.liker_user_id).emit('updateAlreadyLike', valueToUpdate);
            io.to(req.body.liked_user_id).emit('updateAlreadyLike', valueToUpdate);
            //--------------- a supprimer
            const existingLike2 = await userSignupModel.readLikes("liker_user_id", req.body.liker_user_id);
            if (existingLike2) {
                for (let j = 0; j < existingLike2.length; j++) {
                    if (existingLike2[j].liked_user_id == req.body.liked_user_id
                        && existingLike2[j].liker_user_id == req.body.liker_user_id
                    ) {
                        console.log("\n *************************** !!!!!@@@@@ le like existe ENCORE 2 !");
                    }
                }
            }
            //--------------
        } catch (error) {
            res.status(500).json({ message: `\n\nfameRatingController.ts | Error during recording DISlikes : ${error}\n\n` });
            return;
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
    
    static async getWhoLikedMe2(req: Request, res: Response) {//DEBILE
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
                }))
                return ProfilesLikesTab;
            }
            else
                return null;
    } catch (error) {
        res.status(500).json({ message: `fameRatingController.ts | Error during get who likes me : ${error}` });
    }
}

//getWhoILiked

    static async getWhoILiked(req: Request, res: Response) {
        try {
            const value = req.params.idd;
            const numberLikes = await userSignupModel.readLikes("liker_user_id", value);
            if (numberLikes) {
                const ProfilesILiked = await Promise.all(numberLikes.map(async (like) => {
                    const profiles = await userSignupModel.readUserByEmail("id", like.user_id);
                    if (profiles) {
                        return {
                            ...like,
                            first_name: profiles[0].first_name,
                        }
                    }
                }))
                return ProfilesILiked;
            }
            else
                return null;
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get who I liked : ${error}` });
        }
    }

    static async getMatchs(req: Request, res: Response) {
        try {
            // le but cest de dire : si Andre ma like et que je lai like alors match = 1
            //return le nombre de matchs en tableau avec son nom pour afficher dans le fame rating
            const likeTab = await this.getWhoLikedMe2(req, res);
            const ILikedTab = await this.getWhoILiked(req, res);
            const tabMatchs = [];
            if (likeTab && ILikedTab) {
                for (let i = 0; i < likeTab.length; i++) {
                    for (let j = 0; j < ILikedTab.length; j++) {
                        if ((likeTab[i].liker_user_id == ILikedTab[j].liked_user_id) &&
                        (likeTab[i].liked_user_id == ILikedTab[j].liker_user_id)) {
                            console.log("\n\n ----- ", likeTab[i].first_name, " | ", ILikedTab[j].first_name, "-----\n\n");
                            console.log("\n\n ----- ", likeTab[i].liked_user_id , " || ", ILikedTab[j].liker_user_id , "-----\n\n");
                            tabMatchs.push({
                                matchedName: likeTab[i].first_name,
                                myName: ILikedTab[j].first_name,
                                matchedId: likeTab[i].liked_user_id,
                            });
                            break;
                        }
                    }
                }
            }
            if (tabMatchs.length > 0) {
                io.emit('reciproqueMatcha', tabMatchs);
                res.status(201).json( {message : `fameRatingController.ts | Match founded !`, tabMatchs} );
            } else {
                console.log("\n\n\nlength is NOT good\n\n");
                res.status(204).json( {message : `fameRatingController.ts | No content for tabMatch`, tabMatchs} );
            }           
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get matchs : ${error}` });
        }
    }
}
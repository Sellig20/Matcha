import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { UsersLikesCreate, UsersViewsCreate } from "../orm/schema";
import { io } from '../../server';
import { UsersMatchsCreate } from "../orm/schema";
import { table } from "console";
import { match } from "assert";

export class fameRatingController {
    static async recordProfileViews(req: Request, res: Response) {
        try {
            const value = req.body.viewed_id;
            const firstNameBdd = await userSignupModel.readFirstName("id", req.body.viewer_id);
            
            const tableView: UsersViewsCreate = {
                first_name: firstNameBdd,
                user_viewer_id: req.body.viewer_id,
                user_viewed_id: req.body.viewed_id,
                view_started_on: new Date().toISOString(),
                view_ended_on: new Date(Date.now() + 3600000).toISOString(), // Adrien figure this out
            };
            const result = await userSignupModel.createViews(tableView);
            io.emit('insert_view', tableView); // useless
            const count = await this.countViews(value);
            io.emit('update_countViews', count); // useless
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
            // Adrien fix this

            if (existingLike && existingLike[0].liked_user_id === req.body.liked_user_id
                && existingLike[0].liker_user_id === req.body.liker_user_id) {
                    return res.status(200).send({ success: false, message: "Like déjà existant." });
                }

            const tableLikes: UsersLikesCreate = {
                user_id: req.body.user_id,
                first_name: firstNameBdd, // should not have this field
                liked_user_id: req.body.liked_user_id,
                liker_user_id: req.body.liker_user_id,
                liked_on: new Date().toISOString(), // Jadore
            };
            await userSignupModel.createLikes(tableLikes);
            const value = req.body.liker_user_id; // next 4 lines are useless
            io.emit('insert_likes', tableLikes, "\n\n");
            const count = await this.countLikes(value);
            io.emit('update_countLikes', count);
            res.status(201).json({ success: true, message: `likes ok` });
        } catch (error) {
            res.status(500).json({ message: `\n\nfameRatingController.ts | Error during recording likes : ${error}\n\n` });
            return;
        }
    }

    static async getIsThereAMatch(req: Request, res: Response) {
        try {
            const likeTab = await this.getWhoLikedMe2(req, res);
            const ILikedTab = await this.getWhoILiked(req, res);
            
            if (likeTab && ILikedTab) {
                for (let i = 0; i < likeTab.length; i++) {
                    for (let j = 0; j < ILikedTab.length; j++) {
                        const tabMatchs = [];
                        if ((ILikedTab[j].liked_user_id === req.body.liked_user_id) && (likeTab[i].liker_user_id == ILikedTab[j].liked_user_id) &&
                        (likeTab[i].liked_user_id == ILikedTab[j].liker_user_id)) {
                            tabMatchs.push({
                                matchedName: likeTab[i].first_name,
                                myName: ILikedTab[j].first_name,
                                matchedId: req.body.liked_user_id,
                                myId: likeTab[i].liked_user_id,
                            });
                        }
                        //donc separer IS THERE A MATCH de CREATING MATCH
                        //Création du match
                        if (tabMatchs.length > 0) {
                            let existingMatch = await userSignupModel.readMatchas("matcher_user_id", req.body.user_id);
                            if (!existingMatch) {
                                existingMatch = await userSignupModel.readMatchas("matched_user_id", req.body.user_id);
                            }
                            if (existingMatch && tabMatchs) {
                                for(let i = 0; i < existingMatch.length; i++) {
                                    for(let j = 0; j < tabMatchs.length; j++) {
                                        if ((existingMatch[i].matcher_user_id === tabMatchs[j].myId
                                            && existingMatch[i].matched_user_id === tabMatchs[j].matchedId
                                            && existingMatch[i].matched_user_id === req.body.liked_user_id)
                                            ||
                                            (existingMatch[i].matched_user_id === tabMatchs[j].myId
                                            && existingMatch[i].matcher_user_id === tabMatchs[j].matchedId
                                            && existingMatch[i].matched_user_id === req.body.liked_user_id)) {
                                        }
                                        else {
                                            const createMatchbdd: UsersMatchsCreate = {
                                            user_id: tabMatchs[j].myId,
                                            matcher_user_id: tabMatchs[j].myId,
                                            matched_user_id: tabMatchs[j].matchedId,
                                            matched_name: tabMatchs[j].matchedName,
                                            my_name: tabMatchs[j].myName,
                                            };
                                            const matchCreated = await userSignupModel.createMatch(createMatchbdd);
                                            io.emit('reciproqueMatcha', matchCreated);
                                            return matchCreated ;
                                        }
                                    }
                                }
                            }
                            else {
                                //Premier match à créer
                                const createMatchbdd: UsersMatchsCreate = {
                                    user_id: tabMatchs[0].myId,
                                    matcher_user_id: tabMatchs[0].myId,
                                    matched_user_id: tabMatchs[0].matchedId,
                                    matched_name: tabMatchs[0].matchedName,
                                    my_name: tabMatchs[0].myName,
                                    };
                                    const matchCreated = await userSignupModel.createMatch(createMatchbdd);
                                    io.emit('reciproqueMatcha', matchCreated);
                                    return matchCreated ;
                            }
                    }
                }
            }
            } else {
                console.log("\n\nFameRatingController.ts | getIsThereAMatch | Pas de match à créer\n\n");
                return ;
            }           
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get matchs : ${error}` });
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
            // rest is useless just return profile.length
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
                const count = await this.countViews(value);
                res.status(201).json({ message: `get who viewed me ok`, ProfilesViewsTab, count});
            }
            else
            res.status(204).json( {message : `fameRatingController.ts | No content for views `} );
        } catch (error) {
            res.status(201).json({ message: `\n\nfameRatingController.ts | Error during get who viewed me : ${error}\n\n` });
        }
    }
    
    static async updateProfileLikes(req: Request, res: Response) {
        try {
            const existingLike = await userSignupModel.readLikes("liker_user_id", req.body.liker_user_id);
            let valueToUpdate: boolean = false;
            let likeId: number = 0;
            if (existingLike) {
                for (let j = 0; j < existingLike.length; j++) {
                    if (existingLike[j].liked_user_id == req.body.liked_user_id
                        && existingLike[j].liker_user_id == req.body.liker_user_id
                    ) {
                        likeId = existingLike[j].id;
                    }
                }
                const suppression = await userSignupModel.deleteLike(likeId);
                console.log("\n\nFameRatingController.ts | updateProfileLikes | Suppression = ", suppression);
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
                        console.log("\n\nFameRatingController.ts | updateProfileLikes | Le like existe encore");
                    }
                }
            }
            //--------------
        } catch (error) {
            res.status(500).json({ message: `\n\nfameRatingController.ts | Error during recording dislikes : ${error}\n\n` });
            return;
        }
    }

    static async getWhoLikedMe(req: Request, res: Response) {
        try {
            const value = req.userId;
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
            const value = req.userId;;
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

    static async getWhoILiked(req: Request, res: Response) {
        try {
            const value = req.userId;
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
            const likeTab = await this.getWhoLikedMe2(req, res);
            const ILikedTab = await this.getWhoILiked(req, res);
            const tabMatchs = [];
            if (likeTab && ILikedTab) {
                for (let i = 0; i < likeTab.length; i++) {
                    for (let j = 0; j < ILikedTab.length; j++) {
                        if ((likeTab[i].liker_user_id == ILikedTab[j].liked_user_id) &&
                        (likeTab[i].liked_user_id == ILikedTab[j].liker_user_id)) {
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
                return res.status(201).json( {message : `fameRatingController.ts | Match founded !`, tabMatchs} );
            } else {
                res.status(204).json( {message : `fameRatingController.ts | No content for tabMatch`, tabMatchs} );
            }           
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get matchs : ${error}` });
        }
    }

    static async getMatchasbdd(req: Request, res: Response) {
        try {
            const myId = req.userId;
            const sampleIMatchedThem = await userSignupModel.readMatchas("matcher_user_id", myId);
            const sampleTheyMatchedMe = await userSignupModel.readMatchas("matched_user_id", myId);
            if (sampleIMatchedThem && sampleTheyMatchedMe) {
                const IMatchedThem = sampleIMatchedThem.map(( {matched_name, matched_user_id}) => ({matched_name, matched_user_id }));
                const TheyMatchedMe = sampleTheyMatchedMe.map(({my_name, matcher_user_id}) => ({my_name, matcher_user_id}));
                res.status(201).json( {message : `fameRatingController.ts | Match founded !`, IMatchedThem, TheyMatchedMe} );
            } else if (sampleIMatchedThem) {
                const IMatchedThem = sampleIMatchedThem.map(( {matched_name, matched_user_id}) => ({matched_name, matched_user_id }));
                res.status(201).json( {message : `fameRatingController.ts | Match founded !`, IMatchedThem} );
            } else if (sampleTheyMatchedMe) {
                const TheyMatchedMe = sampleTheyMatchedMe.map(({my_name, matcher_user_id}) => ({my_name, matcher_user_id}));
                res.status(201).json( {message : `fameRatingController.ts | Match founded !`, TheyMatchedMe} );
            }
            else {
                res.status(204).json( {message: `No match founded ! MatchingController.ts` });
            }
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get matchas bdd : ${error}` });
        }
    }
}

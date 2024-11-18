import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { userSigninController } from "./userSigninController";
import { io } from '../../server';

export class MatchingController {

    static async sort_SI_GenderController(req: Request, res: Response, list: any[] | undefined) {
        try {
            //liste des users sans moi pour echaffauder
            const my_sexual_interest = req.user?.sexual_interest;
            let tmpList = [];
            if (list && my_sexual_interest === "women") {
                tmpList = list.filter(ind => ind.gender === "female" || ind.gender === "non-binary");
            }
            else if (list && my_sexual_interest === "men") {
                tmpList = list.filter(ind => ind.gender === "male" || ind.gender === "non-binay");
            }
            else if (list && my_sexual_interest === "both") {
                tmpList = list.filter(ind => ind.gender === "female" || ind.gender === "male");                
            }
            
            const my_gender = req.user?.gender;
            let finalList = [];
            if (tmpList && my_gender === "female") {
                finalList = tmpList.filter(ind => ind.sexual_interest === "women");
            }
            else if (tmpList && my_gender === "male") {
                finalList = tmpList.filter(ind => ind.sexual_interest === "men");
            }
            else if (tmpList && my_gender === "non-binary") {
                finalList = tmpList.filter(ind => ind.sexual_interest === "women" || ind.sexual_interest === "male");
            }
            return finalList;
        } catch (error) {
            console.log(`\n\n\nMatchingController.ts sort SI and gender | Error : ${error}\n\n\n`);
            return null;
        };
    };

    static async sortAge(req: Request, res: Response, tab: any[] | null) {
        try {
            const myAge = req.user?.age;
            const myAgeLowerBound = req.user?.age_lower_bound;
            const myAgeUpperBound = req.user?.age_upper_bound;
            let tmplist = [];
            let finalList = [];
            if (tab && myAgeLowerBound && myAgeUpperBound) {
                tmplist = tab.filter(ind => ind.age >= myAgeLowerBound && ind.age <= myAgeUpperBound);
            }
            if (myAge && tmplist) {
                finalList = tmplist.filter(ind => ind.age_lower_bound <= myAge && ind.age_upper_bound >= myAge);
            }
            return finalList;
        } catch (error) {
            console.log(`\n\n\nMatchingController.ts sort age | Error : ${error}\n\n\n`);
            return null;
        }
    }
    
    static async getListUsers(req: Request, res: Response) {//For AllUsers.tsx, from bdd
        try {
            const listTab = await userSignupModel.readUserByEmail();
            const list = listTab?.map(user => user.id);
            const listName = listTab?.map(user => user.user_name);
            res.status(201).json({ message: `List of all users`, list, listName });
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get list users : ${error}` });
            return;
        }
    }
    
    static async sortTags(req: Request, res: Response, tab: any[] | null) {
        try {
            const myTag1 = req.user?.tags_1;
            const myTag2 = req.user?.tags_2;
            const myTag3 = req.user?.tags_3;
            console.log("\n\n ==> ", tab);
            let count = 0;
            tab?.forEach(ind => {
                const t1 = ind.tags_1;
                const t2 = ind.tags_2;
                const t3 = ind.tags_3;
                console.log("\n t1 = ", t1);
                console.log("\n t2 = ", t2);
                console.log("\n t3 = ", t3);
                if (t1 == myTag1) {
                    count +=1;
                }
                if (t2 == myTag2) {
                    count += 1;
                }
                if (t3 == myTag3) {
                    count += 1;
                }
                //count / 3 = 0,3 ou 0.6 ou 1 puis le + proche de 1 = le gagnant
                console.log("\n count = ", count);
            })
            console.log("\n\n ===> myT 1 = ", myTag1, "myT 2 = ", myTag2, "myT 3 = ", myTag3);
        } catch (error) {
            console.log(`\n\n\nMatchingController.ts sort tags | Error : ${error}\n\n\n`);
            return null;
        }
    }
    
    static async sortFirst(req: Request, res: Response, tab: any[] | null) {
        try {
            const myAge = req.user?.age;
            const myAgeL = req.user?.age_lower_bound;
            const myAgeU = req.user?.age_upper_bound;
            if (tab && myAge && myAgeL && myAgeU) {
                const myBoundaries = myAgeU - myAgeL;
                const maxAgeRange = (myAgeU - myAgeL) / 2;
                tab.forEach(ind => {
                    const diff = ((myAge - ind.age) * (-1));
                    const final = Math.max(0 , 1 - (diff / maxAgeRange));
                    ind.matchScore = final;
                });
                const finalTab = tab.sort((a, b) => b.matchScore - a.matchScore);
                return finalTab;
            };
        } catch (error) {
            console.log(`\n\n\nMatchingController.ts sort first | Error : ${error}\n\n\n`);
            return null;
        }
    }
    
    static async sortFameRating(req: Request, res: Response, tab: any | null) {
        try {
            const myFameRating = req.user?.fame_rating;
            let tmpTab = [];
            let finalTab = [];
            //si 

        } catch (error) {
            console.log(`\n\n\nMatchingController.ts sort fame rating | Error : ${error}\n\n\n`);
        }
    }
    
    static async getMatchsUsers(req: Request, res: Response) {//For AllUsers.tsx, from bdd
        try {
            const listTab = await userSignupModel.readUserByEmail();
            const currentId = req.userId;
            const listForAlgo = listTab
            ?.filter(user => user.id !== currentId)
            .map(user => 
                ({
                    id: user.id,
                    user_name: user.user_name,
                    age: user.age,
                    age_lower_bound: user.age_lower_bound,
                    age_upper_bound: user.age_upper_bound,
                    gender: user.gender,
                    sexual_interest: user.sexual_interest,
                    tags_1: user.tags_1,
                    tags_2: user.tags_2,
                    tags_3: user.tags_3,
                    fame_rating: user.fame_rating
                })
            );
            const sorted_SI_gender_tab = await this.sort_SI_GenderController(req, res, listForAlgo);
            const sorted_age_tab = await this.sortAge(req, res, sorted_SI_gender_tab);
            const algo_tags = this.sortTags(req, res, sorted_age_tab);
            const algo_age = await this.sortFirst(req, res, sorted_age_tab);
            const list = sorted_age_tab?.map(user => user.id);
            const listName = algo_age?.map(user => 
                ({ 
                    user_name: user.user_name,
                    id: user.id,
                    age: user.age,
                })
            );
            
            io.to(req.userId).emit('newMatchUser', listName);//From bdd to socket to AllUser.tsx

            res.status(201).json({ message: `List of all users`, listName });
        } catch (error) {
            res.status(500).json({ message: `fameRatingController.ts | Error during get list users : ${error}` });
            return;
        }
    }
};

export default MatchingController;
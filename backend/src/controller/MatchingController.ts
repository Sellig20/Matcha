import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { userSigninController } from "./userSigninController";

export class MatchingController {

    static async sort_SI_GenderController(req: Request, res: Response, list: any[] | undefined) {
        try {
            //liste des users sans moi pour echaffauder
            const my_sexual_interest = req.user?.sexual_interest;
            let tmpList = [];
            if (list && my_sexual_interest === "women") {
                tmpList = list.filter(ind => ind.gender === "female" || ind.gender === "non-binary");
;            }
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
            console.log("\n\n tmplist = ", finalList);
        } catch (error) {
            console.log(`\n\n\nMatchingController.ts | Error : ${error}\n\n\n`);
        };
    };

    static async getListUsers(req: Request, res: Response) {//For AllUsers.tsx, from bdd
        try {
            const listTab = await userSignupModel.readUserByEmail();
            const list = listTab?.map(user => user.id);
            const listName = listTab?.map(user => user.user_name);

            const currentId = req.userId;
            const listForAlgo = listTab
            ?.filter(user => user.id !== currentId)
            .map(user => 
                ({
                    id: user.id,
                    user_name: user.user_name,
                    age: user.age,
                    gender: user.gender,
                    sexual_interest: user.sexual_interest,
                    tags_1: user.tags_1,
                    tags_2: user.tags_2,
                    tags_3: user.tags_3,
                    fame_rating: user.fame_rating
                })
            );
            this.sort_SI_GenderController(req, res, listForAlgo);





            res.status(201).json({ message: `List of all users`, list, listName});
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during get list users : ${error}` });
            return;
        }
    }
};

export default MatchingController;
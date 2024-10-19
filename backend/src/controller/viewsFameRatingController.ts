import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";

export class viewsFameRatingController {
    static async recordProfileViews(req: Request, res: Response) {
        try {
            //ajouter les vues dueuser dans le schema de la bdd en fonction de leur ID
            console.log("\n\n\n\n\n\n\n\n---------------------------");
            console.log("\nje suis id n* ", req);
            console.log("\n\n\n\n\n\n\n\n---------------------------");
        
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during recording views : ${error}` });
            return;
        }
    }

    static async getListUsers(req: Request, res: Response) {
        try {
            const list = await userSignupModel.readAllUsers();
            console.log("\n\n\n LA LISTE => ", list);
            res.status(201).json({ message: `List of all users`, list});
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during get list users : ${error}` });
            return;
        }
    }
}
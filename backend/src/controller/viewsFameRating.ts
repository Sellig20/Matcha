import { Request, Response } from "express";

export class viewsFameRating {
    static async recordProfileViews(req: Request, res: Response) {
        try {
            //ajouter les vues dueuser dans le schema de la bdd en fonction de leur ID
        
        } catch (error) {
            res.status(500).json({ message: `viewsFameRatingController.ts | Error during recording views : ${error}` });
            return;
        }
    }
}
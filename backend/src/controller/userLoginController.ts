import { Request, Response } from "express";
import { userLoginModel } from '../model/userLoginModel';

export class userLoginController {
    static async getLogin(req: Request, res: Response) {
        try {
            console.log("---------- Dans le controller de Login\n");
            const {email, password} = req.body;
            const validUser = await userLoginModel.getLogin(email, password);
            res.json(validUser);
        } catch (err) {
            console.error(err);
            res.status(401).json('xxxxx Erreur dauthentification xxxxxx');
        }
    }
}

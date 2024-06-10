import { Request, Response } from "express";
import { userLoginModel } from './userLoginModel';
import { userPasswordModel } from './userPasswordModel';

export class userLoginController {
    static async getLogin(req: Request, res: Response) {
        try {
            console.log("---------- Dans le controller de Login\n");
            const {email, password} = req.body;
            const validUser = await userLoginModel.getLogin(email, password);
            res.json(validUser);
            const validPassword = await userPasswordModel.getPassword(password);
        } catch (err) {
            console.error(err);
            res.status(401).json('xxxxx Erreur dauthentification xxxxxx');
        }
    }
}

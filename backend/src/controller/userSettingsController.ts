import { Request, Response } from "express";
import { userSettingsModel } from '../model/userSettingsModel';
//dans le controller on utilise le model et son injection pour manipuler les donnees entrantes/sortantes
export class userSettingsController {
    static async getAllUsers(req: Request, res: Response) {
        try {
                console.log("-------- usersettings constroller get all users-----------");
            const users = await userSettingsModel.getAllUsers();
            res.json(users);
            return;
        } catch (err) {
                console.error(err);
            res.status(500).json('Erreur du serveur pour extraction de la table usersettings\n');
            return;
        }
    }

    // static async getUserById(req: Request, res: Response, userId: number) {
    //     try {
    //             console.log("-------- usersettings constroller get user by id-----------");
    //         const users = await userSettingsModel.getUserById(userId);
    //         res.json(users);
    //     } catch (err) {
    //             console.error(err);
    //         res.status(500).json('Erreur du serveur pour extraction de l id');
    //     }
    // }
}
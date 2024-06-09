import { Request, Response } from "express";
import { userSettingsModel } from './userSettingsModel';
//dans le controller on utilise le model et son injection pour manipuler les donnees entrantes/sortantes
export class userSettingsController {
    static async getAllUsers(req: Request, res: Response, userId: number) {
        try {
            console.log("IN CONTROLLLEEEEEEER");
            console.log("userId dans le controller => ", userId);
        const users = await userSettingsModel.getAllUsers(userId);
        res.json(users);
        } catch (err) {
        console.error(err);
        res.status(500).json('Erreur du serveur pour extraction de la table UserProfile');
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            console.log("IN CONTROLLLEEEEEEER");
        const users = await userSettingsModel.getUserById();
        res.json(users);
        } catch (err) {
        console.error(err);
        res.status(500).json('Erreur du serveur pour extraction de l id');
        }
    }
}
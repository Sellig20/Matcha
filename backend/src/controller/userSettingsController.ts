import { Request, Response } from "express";
import { userSettingsModel } from '../model/userSettingsModel';
//dans le controller on utilise le model et son injection pour manipuler les donnees entrantes/sortantes
export class userSettingsController {

    // static async getAllUsers(req: Request, res: Response) {
    //     try {
    //         const users = await userSettingsModel.getAllUsers();
    //         return res.json(users);
    //     } catch (error) {
    //         return res.status(500).json({ message: 'userSettingsController.ts getAllUsers | Server error', error });
    //     }
    // }
}
import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { io } from '../../server';

export class chatController {
    static async postMessages(req: Request, res: Response) {
        try {
            const userId = req.userId;
            console.log("\n\n\n chatcontroller :\n I am : ", userId, "\nor I am : ", req.body.sender_id, "\nI wrote : ", req.body.message, "\nto : ", req.body.receiver_id);
        } catch (error) {
            res.status(204).json({ message: `chatController.ts | Error during posting message text : ${error}` });
        }
    }
}
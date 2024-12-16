import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { io } from '../../server';
import { UsersMessagesCreate } from "../orm/schema";

export class chatController {
    static async postMessages(req: Request, res: Response) {
        try {
            const userId = req.userId;
            // console.log("\n\n\n chatcontroller :\n I am : ", userId, 
            //     "\nor I am : ", req.body.sender_id, 
            //     "\nI wrote : ", req.body.message, 
            //     "\nto : ", req.body.receiver_id);
            const newMessage: UsersMessagesCreate = {
                sender_id: req.body.sender_id,
                receiver_id: req.body.receiver_id,
                message: req.body.message,
                sent_on: new Date().toISOString(),
                seen_on: new Date().toISOString(),
            }
            await userSignupModel.createMessage(newMessage);
            await this.readMessages(req, res);
        } catch (error) {
            res.status(204).json({ message: `chatController.ts | Error during posting message text : ${error}` });
        }
    }

    static async readMessages(req: Request, res: Response) {
        try {
            const userId = req.body.sender_id;
            const interlocuteur_id = req.body.receiver_id;
            // si A parle a B et A parle a C
            //Il faut que je choppe les messages que A a envoye en bdd
            console.log("\n\n************************************chatController.ts | je suis l'envoyeur tu es sur ma page chat a moi : ", Number(userId));
            const result_me_sender = await userSignupModel.readMyMessages("sender_id", Number(userId));
            //il faut que je compare si ces messages sont envoyes a B
            console.log("****************** result_me_sender => ", result_me_sender);
            let tabPushMyMessages = [];
            if (result_me_sender) {
                for(let i = 0; i < result_me_sender.length; i++) {
                    console.log("-------- result_me_sender[i].receiver_id = ", result_me_sender[i].receiver_id, "----------");
                    console.log("-------- interlocuteur_id = ", interlocuteur_id, "----------");
                    if (result_me_sender[i].receiver_id === Number(interlocuteur_id)) {
                        console.log("-------- result_me_sender[i].message = ", result_me_sender[i].message, "----------");
                        tabPushMyMessages.push(
                            {
                                message: result_me_sender[i].message,
                                sent_on: result_me_sender[i].sent_on
                            }
                        );
                    }
                }
            }
            //il faut que je choppe les messages envoyes par B
            console.log("\n\n**************************************chatController.ts | voici mon receiver qui va recevoir mon msg : ", interlocuteur_id);
            const result_user_sender = await userSignupModel.readMyMessages("receiver_id", Number(userId));
            console.log("****************** result_user_sender => ", result_user_sender);
            let tabPushItsMessages = [];
            //ce que je veux cest uand userIdest receiver
            if (result_user_sender) {
                for(let i = 0; i < result_user_sender.length; i++) {
                    console.log("-------- result_user_sender[i].interlocuteur_id = ", result_user_sender[i].receiver_id, "----------");
                    console.log("-------- userId = ", userId, "----------");
                    if (result_user_sender[i].receiver_id === Number(userId) &&
                        result_user_sender[i].sender_id === Number(interlocuteur_id)) {
                        console.log("-------- result_user_sender[i].message = ", result_user_sender[i].message, "----------");
                        tabPushItsMessages.push(
                            {
                                message : result_user_sender[i].message,
                                sent_on: result_user_sender[i].sent_on
                            }
                        );
                    }
                }
            }
            //Il faut que je compare si ces messages sont envoyes a A
            //Aurais-je a ce moment la les messages dans l'ordre ? A prioriiiii
            // res.status(201).json({ message: `chatController.ts | Display Conversation`, result_me_sender, result_user_sender });
            if (result_me_sender && result_user_sender) {
                console.log(`\n\nVoici les messages que moi ${userId} j'envoie à ${interlocuteur_id} : `, tabPushMyMessages);
                console.log(`\n\nVoici les messages que mon interlo ${interlocuteur_id} m'envoie à moi ${userId} : `, tabPushItsMessages);
                io.emit('send_messages_both', {tabMyMsg: tabPushMyMessages}, {tabItsMsg: tabPushItsMessages});
                res.status(200).json({ message: `We both ${userId} | ${interlocuteur_id} sent message`, myMsg: tabPushMyMessages, itsMsg: tabPushItsMessages});
            }
            else if (result_me_sender) {
                io.emit('send_messages_me', {tabMyMsg: tabPushMyMessages});
                res.status(200).json({ message: `Only I ${userId} sent message`, myMsg: tabPushMyMessages});
            }
            else if (result_user_sender) {
                io.emit('send_messages_its', {tabItsMsg: tabPushItsMessages});
                res.status(200).json({ message: `Only this person ${interlocuteur_id} sent message`, itsMsg: tabPushItsMessages});
            }
        } catch (error) {
            res.status(204).json({ message: `chatController.ts | Error during posting message text : ${error}` });
        }
    }
}
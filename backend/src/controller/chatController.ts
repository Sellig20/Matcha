import { Request, Response } from "express";
import { userSignupModel } from "../model/userSignupModel";
import { io } from '../../server';
import { UsersMessagesCreate } from "../orm/schema";
import { clientRedis } from "../../redis";

export class chatController {
    static async postMessages(req: Request, res: Response) {
        try {
            let userId = req.query.sender_id;
            if (!userId)
                userId = req.body.sender_id;
            let interlocuteur_id = req.query.receiver_id;
            if (!interlocuteur_id)
                interlocuteur_id = req.body.receiver_id;
            
            const senderSKid = await clientRedis.get(`user:${userId}`);
            const receiverSKid = await clientRedis.get(`user:${interlocuteur_id}`);

            console.log(`----- CHAT -----\n socket : ${senderSKid} | id : ${userId} 
                \n----------------\n socket : ${receiverSKid} | id : ${interlocuteur_id}
                \n----------------`);
            const newMessage: UsersMessagesCreate = {
                sender_id: req.body.sender_id,
                receiver_id: req.body.receiver_id,
                message: req.body.message,
                sent_on: new Date().toISOString(),
                seen_on: new Date().toISOString(),
            }
            await userSignupModel.createMessage(newMessage);
            console.log("\n\n message emited : ", req.body.message);
            if (userId && interlocuteur_id) {
                const roomId = [userId, interlocuteur_id].sort().join("-");
                console.log("\n\n roomId ==> ", roomId);
                if (senderSKid) {
                    io.sockets.sockets.get(senderSKid)?.join(roomId);
                }
                if (receiverSKid) {
                    io.sockets.sockets.get(receiverSKid)?.join(roomId);
                }
                io.to(roomId).emit("newMessage", {message: req.body.message});
                return res.status(201).json({ message : req.body.message });
            }
        } catch (error) {
            res.status(204).json({ message: `chatController.ts | Error during posting message text : ${error}` });
        }
    }

    static async readMessages(req: Request, res: Response) {
        try {
            let userId = req.query.sender_id;
            if (!userId)
                userId = req.body.sender_id;
            let interlocuteur_id = req.query.receiver_id;
            if (!interlocuteur_id)
                interlocuteur_id = req.body.receiver_id;

            console.log("\n\n --------------\n");
            console.log("userId = ", userId);
            console.log("\ninterlocuteur_id = ", interlocuteur_id);
            console.log("\n--------------\n\n");
            const roomId = [userId, interlocuteur_id].sort().join("-");
            console.log("\n\n roomId ==> ", roomId);
            // io.emit('joinRoomFR', roomId);

            const result_me_sender = await userSignupModel.readMyMessages("sender_id", Number(userId));
            let tabPushMyMessages = [];
            if (result_me_sender) {
                for(let i = 0; i < result_me_sender.length; i++) {
                    if (result_me_sender[i].receiver_id === Number(interlocuteur_id)) {
                        tabPushMyMessages.push(
                            {
                                message: result_me_sender[i].message,
                                sent_on: result_me_sender[i].sent_on
                            }
                        );
                    }
                }
            }
            const result_user_sender = await userSignupModel.readMyMessages("receiver_id", Number(userId));
            let tabPushItsMessages = [];
            if (result_user_sender) {
                for(let i = 0; i < result_user_sender.length; i++) {
                    if (result_user_sender[i].receiver_id === Number(userId) &&
                        result_user_sender[i].sender_id === Number(interlocuteur_id)) {
                        tabPushItsMessages.push(
                            {
                                message : result_user_sender[i].message,
                                sent_on: result_user_sender[i].sent_on
                            }
                        );
                    }
                }
            }
            if (result_me_sender && result_user_sender) {
                console.log("\n\n RES STATUS 1")
                // io.to(roomId).emit('send_messages_both', {tabMyMsg: tabPushMyMessages}, {tabItsMsg: tabPushItsMessages});
                return res.status(200).json({ message: `We both ${userId} | ${interlocuteur_id} sent message`, myMsg: tabPushMyMessages, itsMsg: tabPushItsMessages});
            }

            else if (result_me_sender) {
                console.log("\n\n RES STATUS 2")
                // io.to(roomId).emit('send_messages_me', {tabMyMsg: tabPushMyMessages});
                return res.status(200).json({ message: `Only I ${userId} sent message`, myMsg: tabPushMyMessages});
            }

            else if (result_user_sender) {
                console.log("\n\n RES STATUS 3")
                // io.to(roomId).emit('send_messages_its', {tabItsMsg: tabPushItsMessages});
                return res.status(200).json({ message: `Only this person ${interlocuteur_id} sent message`, itsMsg: tabPushItsMessages});
            }
            else {
                console.log("\n\nCOUAC\n\n");
                res.status(200).json({ message: `COUAC`});
            }
        } catch (error) {
            res.status(204).json({ message: `chatController.ts | Error during posting message text : ${error}` });
        }
    }
}
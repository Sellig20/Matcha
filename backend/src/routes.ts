import { Router } from 'express';
import { userSettingsController } from './userSettingsController';
import { userLoginController } from './userLoginController';
import { Request, Response } from "express";

//on va rediriger ce flux de donnees du controller vers les vues
const router = Router();

router.get('/all', (req: Request, res: Response) => {
    console.log("Dans la routeeeeeeeeeeeeeeeeeeeeeeee"); // Ajoutez votre console.log ici
    userSettingsController.getUserById(req, res);
});

// router.get('/:id', (req: Request, res: Response) => {
//     const userId = parseInt(req.params.id);
//     userSettingsController.getAllUsers(req, res, userId);
// });

router.post('/login', (req: Request, res: Response) => {
    console.log("---------- Dans la route /login");
    userLoginController.getLogin(req, res);
});
export default router;
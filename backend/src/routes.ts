import { Router } from 'express';
import { userSettingsController } from './userSettingsController';
import { userLoginController } from './userLoginController';
import { userSignupController } from './userSignupController'
import { Request, Response } from "express";

//on va rediriger ce flux de donnees du controller vers les vues
const router = Router();

// router.get('/:id', (req: Request, res: Response) => {
//     const userId = parseInt(req.params.id);
//     userSettingsController.getUserById(req, res, userId);
// });

router.get('/allusers', (req: Request, res: Response) => {
    userSettingsController.getAllUsers(req, res);
});

router.post('/login', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller /login --- *** ---");
    userLoginController.getLogin(req, res);
});

router.post('/signup', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller signup --- *** ---");
    userSignupController.signup(req, res);
});

export default router;
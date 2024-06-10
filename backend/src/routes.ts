import { Router } from 'express';
import { userSettingsController } from './userSettingsController';
import { userLoginController } from './userLoginController';
import { userSignupController } from './userSignupController'
import { Request, Response } from "express";

//on va rediriger ce flux de donnees du controller vers les vues
const router = Router();

router.get('/all', (req: Request, res: Response) => {
    userSettingsController.getUserById(req, res);
});

// router.get('/:id', (req: Request, res: Response) => {
//     const userId = parseInt(req.params.id);
//     userSettingsController.getAllUsers(req, res, userId);
// });

router.post('/login', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller /login --- *** ---");
    userLoginController.getLogin(req, res);
});

router.post('/signup', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller signup --- *** ---");
    userSignupController.signup(req, res);
});

export default router;
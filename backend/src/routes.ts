import { Router } from 'express';
import { userSettingsController } from './controller/userSettingsController';
import { userLoginController } from './controller/userLoginController';
import { userSignupController } from './controller/userSignupController'
import { Request, Response } from "express";
import { authenticateWithToken } from "./authMiddleware";

//on va rediriger ce flux de donnees du controller vers les vues
const router = Router();

router.get('/allusers', (req: Request, res: Response) => {
    userSettingsController.getAllUsers(req, res);
});

router.post('/signup', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller /signup --- *** ---");
    userSignupController.signup(req, res);
});

router.post('/login', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller /login --- *** ---");
    userLoginController.getLogin(req, res);
});

//------------------------- once authenticated ------------------------------------//
router.get('/home', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
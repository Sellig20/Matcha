import { Router } from 'express';
import { userSettingsController } from './controller/userSettingsController';
import { userLoginController } from './controller/userLoginController';
import { userSignupController } from './controller/userSignupController'
import { Request, Response } from "express";
import { authenticateWithToken } from "./authMiddleware";
import { verifyToken } from './controller/userSignupController';

//on va rediriger ce flux de donnees du controller vers les vues
const router = Router();

// router.get('/:id', (req: Request, res: Response) => {
//     const userId = parseInt(req.params.id);
//     userSettingsController.getUserById(req, res, userId);
// });

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
router.get('/homezinzin', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected zinzin route', user: req.user });
});
// router.get('/home', authenticateWithToken);
// router.use('/home', authenticateWithToken);

// router.post('/home', (req: Request, res: Response) => {
//     console.log("----- *** ------- Dans la route du controller /login --- *** ---");
//     userLoginController.getLogin(req, res);
// });
export default router;
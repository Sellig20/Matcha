import { Router } from 'express';
import { userSettingsController } from './controller/userSettingsController';
import { userSigninController } from './controller/userSigninController';
import { userSignupController } from './controller/userSignupController';
import { userProfileController } from './controller/userProfileController';
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

router.post('/signin', (req: Request, res: Response) => {
    console.log("----- *** ------- Dans la route du controller /login --- *** ---");
    userSigninController.getLogin(req, res);
});

//------------------------- once authenticated ------------------------------------//
router.get('/usersettings', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /USERSETTINGS', user: req.user });
});

router.post('/userprofile', authenticateWithToken, (req, res) => {
    console.log("\n\n\n\nuserrrrr proooooofile routes.ts");
    userProfileController.getUserIdProfile(req, res);
});

router.get('/userprofile/display', authenticateWithToken, (req, res) => {
    console.log("\n\n user profile --- display route.ts");
    userProfileController.displayProfile(req, res);
})

// router.post('/userprofile/fill', authenticateWithToken, (req, res) => {
//     console.log("\n\n\n\nuserrrrr profile FILL routes.ts");
//     userProfileController.fillProfile(req, res);
// });

router.get('/match', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MATCH', user: req.user });
});

router.get('/chat', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /CHAT', user: req.user });
});

router.get('/fm', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /FM', user: req.user });
});

router.get('/checktok', authenticateWithToken, (req, res) => {
    res.json({ valid: true });
});

export default router;
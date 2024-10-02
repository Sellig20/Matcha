import { Router } from 'express';
import { userSettingsController } from './controller/userSettingsController';
import { userSigninController } from './controller/userSigninController';
import { userSignupController } from './controller/userSignupController';
import { userProfileController } from './controller/userProfileController';
import { Request, Response } from "express";
import { authenticateWithToken } from "./authMiddleware";

const router = Router();

// router.get('/allusers', (req: Request, res: Response) => {
//     userSettingsController.getAllUsers(req, res);
// });

router.post('/signup', (req: Request, res: Response) => {
    userSignupController.signup(req, res);
});

router.post('/signin', (req: Request, res: Response) => {
    userSigninController.getLogin(req, res);
});

//------------------------- once authenticated ------------------------------------//

//------------------------- NAVBAR ------------------------------------------------//
router.post('/userprofile', authenticateWithToken, (req, res) => {
    console.log("Form values received:", req.body); 
    userProfileController.getUserIdProfile(req, res);
});

router.get('/userprofile/display', authenticateWithToken, (req, res) => {
    console.log("\n\n user profile --- display route.ts");
    userProfileController.displayProfile(req, res);
    
})

router.get('/mymatchaprofile', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MY MATCHA PROFILE', user: req.user });
});

router.get('/match', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MATCH', user: req.user });
});

router.get('/fm', authenticateWithToken, (req, res) => {
    console.log("--------- fm routes.ts -------------");
    res.json({ message: 'This is a protected route -- /FM', user: req.user });
});

router.get('/chat', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /CHAT', user: req.user });
});

router.get('/map', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MAP', user: req.user });
});

router.get('/checktok', authenticateWithToken, (req, res) => {
    res.json({ valid: true });
});

//------------------------------ SIDEBAR ---------------------------------------//
router.get('/usersettings', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /USERSETTINGS', user: req.user });
});

router.get('/confidentialitypolitic', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /CONFIDENTIALITY POLITIC', user: req.user });
});

router.get('/report', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /REPORT SOMETHING', user: req.user });
});
export default router;
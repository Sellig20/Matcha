import { Router } from 'express';
import { userSettingsController } from './controller/userSettingsController';
import { userSigninController } from './controller/userSigninController';
import { userSignupController } from './controller/userSignupController';
import { userProfileController } from './controller/userProfileController';
import { Request, Response } from "express";
import { authenticateWithToken } from "./authMiddleware";

const router = Router();

router.post('/signup', (req: Request, res: Response) => {
    userSignupController.signup(req, res);
});

router.post('/signin', (req: Request, res: Response) => {
    userSigninController.getLogin(req, res);
});

//------------------------- once authenticated ------------------------------------//

//------------------------- NAVBAR ------------------------------------------------//
router.post('/userprofile', authenticateWithToken, (req, res) => {
    userProfileController.joinNewProfile(req, res);
});

router.get('/userprofile/display', authenticateWithToken, (req, res) => {
    userProfileController.displayProfile(req, res);
})

router.put('/userprofile/display/updated', authenticateWithToken, (req, res) => {
    // userProfileController.displayProfileUpdated(req, res);
})

router.get('/mymatchaprofile', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MY MATCHA PROFILE', user: req.user });
});

router.get('/match', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MATCH', user: req.user });
});

router.get('/fm', authenticateWithToken, (req, res) => {
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

router.put('/usersettings', authenticateWithToken, (req, res) => {
    userProfileController.updateUserSettings(req, res);
});

router.get('/confidentialitypolitic', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /CONFIDENTIALITY POLITIC', user: req.user });
});

router.get('/report', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /REPORT SOMETHING', user: req.user });
});
export default router;
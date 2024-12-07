import { Router } from 'express';
import { userSettingsController } from './controller/userSettingsController';
import { fameRatingController } from './controller/fameRatingController';
import { userSigninController } from './controller/userSigninController';
import { userSignupController } from './controller/userSignupController';
import { userProfileController } from './controller/userProfileController';
import { MatchingController } from './controller/MatchingController';
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
router.get('/isprofilecomplete', authenticateWithToken, (req, res) => {
    userSignupController.isProfileComplete(req, res);
});

router.post('/userprofile', authenticateWithToken, (req, res) => {
    userProfileController.joinNewProfile(req, res);
});

router.get('/userprofile/display', authenticateWithToken, (req, res) => {
    userProfileController.displayProfile(req, res);
})

router.put('/userprofile', authenticateWithToken, (req, res) => {
    userProfileController.joinNewProfile(req, res);
});

router.get('/navbar', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /NAVBAR', userId: req.userId });
});

router.get('/mymatchaprofile', authenticateWithToken, (req, res) => {
    res.json({ message: 'This is a protected route -- /MY MATCHA PROFILE', user: req.user, userId: req.userId });
});

router.get('/allusers', authenticateWithToken, (req, res) => {
    MatchingController.getListUsers(req, res);
});

router.get('/matchsusers', authenticateWithToken, (req, res) => {
    MatchingController.getMatchsUsers(req, res);
});

router.get('/userproduct/:idd', authenticateWithToken, (req, res) => {
    fameRatingController.readProductProfile(req, res);
});

router.get('/userproduct/suggestions', authenticateWithToken, (req, res) => {
    fameRatingController.readProductProfile(req, res);
});

router.post('/views', authenticateWithToken, (req, res) => {
    fameRatingController.recordProfileViews(req, res);
});

router.post('/likes', authenticateWithToken, (req, res) => {
    fameRatingController.recordProfileLikes(req, res);
});

router.post('/dislikes', authenticateWithToken, (req, res) => {
    fameRatingController.updateProfileLikes(req, res);
});

router.get('/views/:idd', authenticateWithToken, (req, res) => {
    fameRatingController.getWhoViewedMe(req, res);
});

router.get('/likes/:idd', authenticateWithToken, (req, res) => {
    fameRatingController.getWhoLikedMe(req, res);
});

router.get('/matchasnumber/:idd', authenticateWithToken, (req, res) => {
    fameRatingController.getMatchs(req, res);
});

router.get('/matchasbdd', authenticateWithToken, (req, res) => {
    fameRatingController.getMatchasbdd(req, res);
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
import * as ProfileController from "../controllers/profile";
import Router from "express-promise-router";

//@ts-expect-error weird constructor error, to investiate later
const profileRoutes = new Router();

profileRoutes.get("/", ProfileController.getProfile);

export default profileRoutes;
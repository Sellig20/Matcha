import * as SignInController from "../controllers/signIn";
import Router from "express-promise-router";

//@ts-expect-error weird constructor error, to investiate later
const signInRoutes = new Router();

signInRoutes.get("/", SignInController.signIn);

export default signInRoutes;
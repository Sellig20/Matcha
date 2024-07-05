import * as SignUpController from "../controllers/signUp";
import Router from "express-promise-router";

//@ts-expect-error weird constructor error, to investiate later
const signUpRoutes = new Router();

signUpRoutes.get("/", SignUpController.signUp);

export default signUpRoutes;
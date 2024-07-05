import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import cookieParser from 'cookie-parser';
import authMiddleware from "./middlewares/authMiddleware";

import signInRoutes from "./routes/signIn";
import signUpRoutes from "./routes/signUp";
import profileRoutes from "./routes/profile";

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use("/api/signin", signInRoutes);

app.use("/api/signup", signUpRoutes);

app.use(authMiddleware);

app.use("/api/profile", profileRoutes);

app.use((req, res, next) => {
    next(createHttpError(404,"Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "Unknown error";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
})

export default app;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../utils/validateEnv';
import createHttpError from 'http-errors';

interface ResquestWithUserId extends Request {
    userId?: string;
}

const authMiddleware = (req: ResquestWithUserId, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        next(createHttpError(400, "Invalid token"));

    }
};

export default authMiddleware;

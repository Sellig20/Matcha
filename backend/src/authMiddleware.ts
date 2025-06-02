import { Request, Response, NextFunction } from "express";
import { UserProfileInterface } from "./databaseInterfaces";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userSignupModel } from "./model/userSignupModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

declare module "express-serve-static-core" {
  interface Request {
    user?: UserProfileInterface;
    userId?: string;
  }
}

export async function authenticateWithToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //protection pour 1 regex
  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: `Unauthorized action` });
  }
  if (!JWT_SECRET) {
    return res
      .status(401)
      .json({ valid: false, message: `Unauthorized action` });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      idCreatedUser: number;
    };
    const user = await userSignupModel.readUser("id", decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ valid: false, message: `Unauthorized action` });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      valid: false,
      message: `AuthMiddleware.ts | Error : authMiddleware backend error du try : ${err}`,
    });
  }
}

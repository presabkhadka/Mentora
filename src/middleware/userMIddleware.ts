import { type Request, type Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Users } from "../db/db";

dotenv.config();

export default async function userMIddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    let JWT_PASS = process.env.JWT_PAS;
    if (!token) {
      res.status(401).json({
        msg: "No token found in headers",
      });
      return;
    }

    let decode =jwt.verify(token, JWT_PASS as string);
    let userEmail = (decode as jwt.JwtPayload).email;
    let existingUser =await Users.findOne({
      email: userEmail,
    });

    if (!existingUser) {
      res.status(404).json({
        msg: "No such user found in our db",
      });
      return;
    }

    req.user = userEmail;
    next();

  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

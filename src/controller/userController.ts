import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { Content, Users } from "../db/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtPass = process.env.JWT_PASS;

export async function userSignup(req: Request, res: Response) {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        msg: "Bad Request, Input fields cannot be left empty",
      });
      return;
    }

    let existingUser = await Users.findOne({
      email,
    });

    if (existingUser) {
      res.status(409).json({
        msg: "A user with this email already exists in our db",
      });
      return;
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      msg: "User created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function userLogin(req: Request, res: Response) {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        msg: "Bad Request, Input fields cannot be left empty",
      });
      return;
    }

    let existingUser = await Users.findOne({
      email,
    });

    if (!existingUser) {
      res.status(404).json({
        msg: "No such user found in our db",
      });
      return;
    }

    let token = jwt.sign({ email }, jwtPass!);

    res.status(200).json({
      msg: token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function addContent(req: Request, res: Response) {
  try {
    let { link, type, title, tags } = req.body;

    let token = req.headers.authorization?.split(" ")[1];

    let decoded = jwt.verify(token!, jwtPass!);

    let userEmail = (decoded as jwt.JwtPayload).email;

    if (!userEmail) {
      res.status(401).json({
        msg: "Unauthorized access",
      });
      return;
    }

    let existingUser = await Users.findOne({
      email: userEmail,
    });

    if (!existingUser) {
      res.status(404).json({
        msg: "No such user found in our db",
      });
      return;
    }

    let userId = existingUser?._id;

    await Content.create({
      link,
      tags,
      title,
      type,
      userId: userId,
    });

    res.status(200).json({
      msg: "Content created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

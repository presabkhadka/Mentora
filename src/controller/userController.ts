import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { Users } from "../db/db";

export async function userSignup(req: Request, res: Response) {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        msg: "Bad Request, Input fields cannot be left empty",
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

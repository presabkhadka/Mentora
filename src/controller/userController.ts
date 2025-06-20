import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { Content, Tags, Users } from "../db/db";
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
    let newTag;

    // @ts-ignore
    let user = req.user;

    let existingUser = await Users.findOne({
      email: user,
    });

    if (!existingUser) {
      res.status(404).json({
        msg: "No such user found in our db",
      });
      return;
    }

    let userId = existingUser?._id;

    let existingTag = await Tags.findOne({
      title: tags,
    });

    if (!existingTag) {
      newTag = await Tags.create({
        title: tags,
      });
    }

    if (existingTag) {
      await Content.create({
        link,
        tags: existingTag._id,
        title,
        type,
        userId: userId,
      });
    } else {
      await Content.create({
        link,
        tags: newTag?._id,
        title,
        type,
        userId: userId,
      });
    }

    res.status(201).json({
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

export async function viewContent(req: Request, res: Response) {
  try {
    // @ts-ignore
    let user = req.user;

    let existingUser = await Users.findOne({
      email: user,
    });

    let userId = existingUser!._id;

    let contents = await Content.find({
      userId,
    });

    res.status(200).json({
      contents,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function deleteContent(req: Request, res: Response) {
  try {
    let { contentId } = req.params;

    if (!contentId) {
      res.status(400).json({
        msg: "No content id found in parameters",
      });
      return;
    }

    let contentExists = await Content.findOne({
      _id: contentId,
    });

    if (!contentExists) {
      res.status(404).json({
        msg: "No such content found in our db",
      });
      return;
    }

    await Content.deleteOne({
      _id: contentId,
    });

    res.status(200).json({
      msg: "Content deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

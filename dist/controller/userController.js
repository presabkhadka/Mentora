"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.addContent = addContent;
exports.viewContent = viewContent;
exports.deleteContent = deleteContent;
exports.youtubeContent = youtubeContent;
exports.twitterContent = twitterContent;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtPass = process.env.JWT_PASS;
async function userSignup(req, res) {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                msg: "Bad Request, Input fields cannot be left empty",
            });
            return;
        }
        let existingUser = await db_1.Users.findOne({
            email,
        });
        if (existingUser) {
            res.status(409).json({
                msg: "A user with this email already exists in our db",
            });
            return;
        }
        let hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_1.Users.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(200).json({
            msg: "User created successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}
async function userLogin(req, res) {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                msg: "Bad Request, Input fields cannot be left empty",
            });
            return;
        }
        let existingUser = await db_1.Users.findOne({
            email,
        });
        if (!existingUser) {
            res.status(404).json({
                msg: "No such user found in our db",
            });
            return;
        }
        let passwordMatch = await bcrypt_1.default.compare(password, existingUser.password);
        if (!passwordMatch) {
            res.status(401).json({
                msg: "Password didn't matched",
            });
            return;
        }
        let token = jsonwebtoken_1.default.sign({ email }, jwtPass);
        res.status(200).json({
            msg: token,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}
async function addContent(req, res) {
    try {
        let { link, type, title, tags } = req.body;
        let newTag;
        // @ts-ignore
        let user = req.user;
        let existingUser = await db_1.Users.findOne({
            email: user,
        });
        if (!existingUser) {
            res.status(404).json({
                msg: "No such user found in our db",
            });
            return;
        }
        let userId = existingUser?._id;
        let existingTag = await db_1.Tags.findOne({
            title: tags,
        });
        if (!existingTag) {
            newTag = await db_1.Tags.create({
                title: tags,
            });
        }
        if (existingTag) {
            await db_1.Content.create({
                link,
                tags: existingTag._id,
                title,
                type,
                userId: userId,
            });
        }
        else {
            await db_1.Content.create({
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}
async function viewContent(req, res) {
    try {
        // @ts-ignore
        let user = req.user;
        let existingUser = await db_1.Users.findOne({
            email: user,
        });
        let userId = existingUser._id;
        let contents = await db_1.Content.find({
            userId,
        }).populate("tags");
        res.status(200).json({
            contents,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}
async function deleteContent(req, res) {
    try {
        let { contentId } = req.params;
        if (!contentId) {
            res.status(400).json({
                msg: "No content id found in parameters",
            });
            return;
        }
        let contentExists = await db_1.Content.findOne({
            _id: contentId,
        });
        if (!contentExists) {
            res.status(404).json({
                msg: "No such content found in our db",
            });
            return;
        }
        await db_1.Content.deleteOne({
            _id: contentId,
        });
        res.status(200).json({
            msg: "Content deleted successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}
async function youtubeContent(req, res) {
    try {
        // @ts-ignore
        let user = req.user;
        let existingUser = await db_1.Users.findOne({
            email: user,
        });
        if (!existingUser) {
            res.status(404).json({
                msg: "No such  user found in our db",
            });
            return;
        }
        let contentType = "youtube";
        let userId = existingUser._id;
        let content = await db_1.Content.find({
            userId: userId,
            type: contentType,
        });
        res.status(200).json({
            content,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            msg: error.message;
        }
    }
}
async function twitterContent(req, res) {
    try {
        // @ts-ignore
        let user = req.user;
        let existingUser = await db_1.Users.findOne({
            email: user,
        });
        if (!existingUser) {
            res.status(404).json({
                msg: "No such user found in our db",
            });
            return;
        }
        let userId = existingUser._id;
        let contentType = "x";
        let content = await db_1.Content.find({
            userId,
            type: contentType,
        });
        res.status(200).json({
            content,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}

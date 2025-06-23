"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userMIddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db/db");
dotenv_1.default.config();
async function userMIddleware(req, res, next) {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        let JWT_PASS = process.env.JWT_PASS;
        if (!token) {
            res.status(401).json({
                msg: "No token found in headers",
            });
            return;
        }
        let decode = jsonwebtoken_1.default.verify(token, JWT_PASS);
        let userEmail = decode.email;
        let existingUser = await db_1.Users.findOne({
            email: userEmail,
        });
        if (!existingUser) {
            res.status(404).json({
                msg: "No such user found in our db",
            });
            return;
        }
        // @ts-ignore
        req.user = userEmail;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                msg: error.message,
            });
        }
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const userMIddleware_1 = __importDefault(require("../middleware/userMIddleware"));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post("/signup", userController_1.userSignup);
userRouter.post("/login", userController_1.userLogin);
userRouter.post("/add-content", userMIddleware_1.default, userController_1.addContent);
userRouter.get("/content", userMIddleware_1.default, userController_1.viewContent);
userRouter.delete("/delete-content/:contentId", userMIddleware_1.default, userController_1.deleteContent);
userRouter.get("/x-content", userMIddleware_1.default, userController_1.twitterContent);
userRouter.get("/yt-content", userMIddleware_1.default, userController_1.youtubeContent);

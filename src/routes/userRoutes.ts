import { Router } from "express";
import { userSignup } from "../controller/userController";

const userRouter = Router();

userRouter.post("/signup", userSignup);

export {userRouter}

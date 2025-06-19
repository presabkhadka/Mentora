import { Router } from "express";
import { userLogin, userSignup } from "../controller/userController";

const userRouter = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);

export { userRouter };

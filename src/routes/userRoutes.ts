import { Router } from "express";
import {
  addContent,
  userLogin,
  userSignup,
  viewContent,
} from "../controller/userController";
import userMIddleware from "../middleware/userMIddleware";

const userRouter = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.post("/add-content", userMIddleware, addContent);
userRouter.get("/content", userMIddleware, viewContent);

export { userRouter };

import { Router } from "express";
import {
  addContent,
  deleteContent,
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
userRouter.delete("/delete-content/:contentId", deleteContent);

export { userRouter };

import { Router } from "express";
import {
  addContent,
  deleteContent,
  fetchingContents,
  twitterContent,
  userLogin,
  userSignup,
  viewContent,
  youtubeContent,
} from "../controller/userController";
import userMIddleware from "../middleware/userMIddleware";

const userRouter = Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.post("/add-content", userMIddleware, addContent);
userRouter.get("/content", userMIddleware, viewContent);
userRouter.delete("/delete-content/:contentId", userMIddleware, deleteContent);
userRouter.get("/x-content", userMIddleware, twitterContent);
userRouter.get("/yt-content", userMIddleware, youtubeContent);
userRouter.get("/try", fetchingContents);

export { userRouter };

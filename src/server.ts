import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routes/userRoutes";
import { rateLimit } from "express-rate-limit";

dotenv.config();

let limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  legacyHeaders: false,
  standardHeaders: "draft-8",
});

const app = express();
const port = process.env.port;
app.use(express.json());
app.use(cors());
app.use(limiter);

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

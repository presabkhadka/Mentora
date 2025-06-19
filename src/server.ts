import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.port;
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

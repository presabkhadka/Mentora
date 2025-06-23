"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = require("./routes/userRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.port;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/user", userRoutes_1.userRouter);
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

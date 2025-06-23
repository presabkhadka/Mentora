"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Tags = exports.Content = exports.Users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let user = process.env.DB_USER;
let pass = process.env.DB_PW;
mongoose_1.default.connect(`mongodb+srv://${user}:${pass}@cluster0.g6wpo.mongodb.net/mentora`);
const contentTypes = ["youtube", "x"];
const userSchema = new mongoose_1.default.Schema({
    username: String,
    email: String,
    password: String,
});
const contentSchema = new mongoose_1.default.Schema({
    link: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        enum: contentTypes,
    },
    title: {
        type: String,
        require: true,
    },
    tags: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tags",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
    },
});
const tagSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        require: true,
    },
});
const linkSchema = new mongoose_1.default.Schema({
    hash: {
        type: String,
        require: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
    },
});
exports.Users = mongoose_1.default.model("Users", userSchema);
exports.Content = mongoose_1.default.model("Content", contentSchema);
exports.Tags = mongoose_1.default.model("Tags", tagSchema);
exports.Link = mongoose_1.default.model("Link", linkSchema);
module.exports = {
    Users: exports.Users,
    Content: exports.Content,
    Tags: exports.Tags,
    Link: exports.Link,
};

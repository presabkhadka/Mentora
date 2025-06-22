import mongoose from "mongoose";
import dotnev from "dotenv";

dotnev.config();

let user = process.env.DB_USER;
let pass = process.env.DB_PW;

mongoose.connect(
  `mongodb+srv://${user}:${pass}@cluster0.g6wpo.mongodb.net/mentora`
);

const contentTypes = ["youtube", "x"];

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const contentSchema = new mongoose.Schema({
  
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tags",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
});

const linkSchema = new mongoose.Schema({
  hash: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

export const Users = mongoose.model("Users", userSchema);
export const Content = mongoose.model("Content", contentSchema);
export const Tags = mongoose.model("Tags", tagSchema);
export const Link = mongoose.model("Link", linkSchema);

module.exports = {
  Users,
  Content,
  Tags,
  Link,
};

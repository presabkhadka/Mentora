import mongoose, { mongo, Mongoose } from "mongoose";

mongoose.connect(
  "mongodb+srv://presabkhadka30:fRANqisUqmoJ5AkK@cluster0.g6wpo.mongodb.net/mentora"
);

const contentTypes = ["image", "video", "article", "audio"];

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

module.exports({
  Users,
  Content,
  Tags,
  Link,
});

import express from "express";
import multer from "multer";
const posts = express.Router();
import * as fs from "fs";
import {
  createNewPost,
  getAllPosts,
  changeVote,
  addComment,
  changeCommentVote,
} from "./service.js";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = `./storage/posts`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.filename}-${Date.now()}.${file.mimetype.replace("image/", "")}`
    );
  },
});
const upload = multer({ storage: storage });

posts.get("/query", async (req, res, next) => {
  res.json(await getAllPosts(req.query.sort));
});
posts.put("/modify/:postId/changeVote", async (req, res, next) => {
  res.json(await changeVote(req.params.postId, req.query.action));
});

posts.post("/:postId/comments/add", async (req, res, next) => {
  res.json(addComment(req.params.postId, req.body));
});
posts.put("/:postId/comments/:commentId/changeVote", async (req, res, next) => {
  res.json(
    await changeCommentVote(
      req.params.postId,
      req.params.commentId,
      req.query.action
    )
  );
});

posts.post("/create", upload.single("postImage"), async (req, res, next) => {
  try {
    console.log(req.body);
    res.json(await createNewPost(req.body, req.file));
  } catch (error) {
    res.json({ message: "Error in file upload", error: true });
  }
});

export default posts;

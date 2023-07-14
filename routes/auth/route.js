import express from "express";
const auth = express.Router();
import multer from "multer";
import * as fs from "fs";
import "dotenv/config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = `./storage/profilePictures`;
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
import {
  createNewUser,
  loginUser,
  generateAccessToken,
  authenticateToken,
} from "./service.js";

auth.post(
  "/signup",
  upload.single("profilePicture"),
  async (req, res, next) => {
    console.log(req.body);
    res.json(await createNewUser(req.body, req.file));
  }
);
auth.post("/signin", async (req, res, next) => {
  const response = await loginUser(req.body.username, req.body.password);
  if (!response) {
    res.status(403);
    res.json({ msg: "Incorrect password or username" });
  } else {
    res.json({ token: response });
  }
});
auth.get("/checkToken", authenticateToken, (req, res) => {
  res.json({ msg: "Token match" });
});

export default auth;

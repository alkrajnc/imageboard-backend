import express from "express";
const user = express.Router();
import { getUserData, getUserComments } from "./service.js";

user.get("/:username/query", async (req, res, next) => {
  res.json(await getUserData(req.params.username));
});
user.get("/:username/comments", async (req, res, next) => {
  res.json(await getUserComments(req.params.username));
});
export default user;

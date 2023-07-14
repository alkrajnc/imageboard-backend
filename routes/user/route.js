import express from "express";
const user = express.Router();
import { getUserData } from "./service.js";

user.get("/:username/query", async (req, res, next) => {
  res.json(await getUserData(req.params.username));
});

export default user;

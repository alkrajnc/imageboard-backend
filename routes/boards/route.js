import express from "express";
const boards = express.Router();

import { getBoards } from "./service.js";

boards.get("/", async (req, res, next) => {
  res.json(await getBoards());
});

export default boards;
